# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import datetime
import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

import constants
from services import dataset_service, forecast_job_coordinator, forecast_job_service
from training_methods import (
    automl_training_method,
    bqml_training_method,
    debug_training_method,
    training_method,
)

logger = logging.getLogger(__name__)
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

from models import forecast_job_request
from services import dataset_service

app = FastAPI()

# Auto-detect all imported training methods
training_registry: Dict[str, training_method.TrainingMethod] = {
    method.id: method
    for method in [
        method_class()
        for method_class in training_method.TrainingMethod.__subclasses__()
    ]
}


training_service_instance = forecast_job_service.ForecastJobService(
    training_registry=training_registry
)
training_jobs_manager_instance = forecast_job_coordinator.MemoryTrainingJobCoordinator(
    forecast_job_service=training_service_instance
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/datasets")
async def datasets():
    return [dataset.as_response() for dataset in dataset_service.get_datasets()]


@app.get("/dataset/{dataset_id}")
def get_dataset(dataset_id: str):
    dataset = dataset_service.get_dataset(dataset_id=dataset_id)
    if dataset is None:
        raise HTTPException(
            status_code=404, detail=f"Dataset id {dataset_id} was not found!"
        )
    else:
        return dataset


@app.get("/preview-dataset/{dataset_id}")
def preview_dataset(dataset_id: str):

    target_dataset = dataset_service.get_dataset(dataset_id)

    if target_dataset is None:
        raise HTTPException(
            status_code=404, detail=f"Dataset id {dataset_id} was not found!"
        )
    else:
        return target_dataset.df_preview.to_dict(orient="records")


@app.get("/forecast-job/{job_id}")
def get_forecast_job(job_id: str):
    completed_job = training_jobs_manager_instance.get_completed_job(job_id=job_id)

    if completed_job is not None:
        return completed_job.as_response()
    else:
        pending_job_request = training_jobs_manager_instance.get_request(job_id=job_id)

        if pending_job_request:
            return {
                "jobId": pending_job_request.id,
                "request": pending_job_request.as_response(),
            }
        else:
            raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")


@app.get("/jobs")
def jobs():
    pending_jobs = [
        {
            "jobId": job.id,
            "request": job.as_response(),
        }
        for job in training_jobs_manager_instance.list_pending_jobs()
    ]
    completed_jobs = [
        job.as_response()
        for job in training_jobs_manager_instance.list_completed_jobs()
    ]
    return pending_jobs + completed_jobs


class SubmitForecastJobAPIRequest(BaseModel):
    """A forecast job request includes information to train a model, evaluate it and create a forecast prediction.

    Args:
        training_method_name (str): The unique key associated with a training method.
        dataset_id (str): The dataset id to be used for training.
        model_parameters (Dict[str, Any]): Parameters for training.
        prediction_parameters (Dict[str, Any]): Parameters for training.
    """

    trainingMethodId: str
    datasetId: str
    modelParameters: Optional[Dict[str, Any]] = None
    predictionParameters: Optional[Dict[str, Any]] = None


@app.post("/submit-forecast-job")
def submitForecastJob(
    request: SubmitForecastJobAPIRequest,
):
    dataset = dataset_service.get_dataset(dataset_id=request.datasetId)
    training_method = training_registry.get(request.trainingMethodId)

    if dataset is None:
        raise HTTPException(
            status_code=404, detail=f"Dataset not found: {request.datasetId}"
        )

    if training_method is None:
        raise HTTPException(
            status_code=404,
            detail=f"Training method not found: {request.trainingMethodId}",
        )

    try:
        job_id = training_jobs_manager_instance.enqueue_job(
            forecast_job_request.ForecastJobRequest(
                start_time=datetime.datetime.now(datetime.timezone.utc),
                training_method_id=training_method.id,
                training_method_display_name=training_method.display_name,
                dataset=dataset,
                model_parameters=request.modelParameters or {},
                prediction_parameters=request.predictionParameters or {},
            )
        )
    except Exception as exception:
        logger.error(str(exception))
        raise HTTPException(
            status_code=400, detail=f"There was a problem enqueueing your job"
        )

    return {"jobId": job_id}


# Get evaluation
@app.get("/evaluation/{job_id}")
async def evaluation(job_id: str):
    evaluation = training_jobs_manager_instance.get_evaluation(job_id=job_id)

    if evaluation is None:
        raise HTTPException(status_code=404, detail=f"Evaluation not found: {job_id}")
    else:
        evaluation = evaluation.fillna("")
        evaluation["id"] = evaluation.index

        columns = evaluation.columns.tolist()
        for column in columns:
            evaluation[column] = evaluation[column].apply(
                lambda x: x.tolist() if isinstance(x, np.ndarray) else x
            )

        output = {
            "columns": columns,
            "rows": evaluation.astype(str).to_dict(orient="records"),
        }

        return output


def format_for_plotly(
    time_series_identifier_column: str,
    time_column: str,
    target_column: str,
    data: pd.DataFrame,
) -> List[Dict[str, Any]]:
    data_grouped = data.sort_values([time_column]).groupby(
        time_series_identifier_column
    )

    return [
        {
            "name": group,
            "mode": "lines",
            "x": data_for_group[time_column].tolist(),
            "y": data_for_group[target_column].tolist(),
        }
        for (group, data_for_group) in data_grouped
    ]


def format_for_rechart(
    time_series_identifier_column: str,
    time_column: str,
    target_column: str,
    data: pd.DataFrame,
) -> Tuple[
    List[Dict[str, Any]], Optional[datetime.datetime], Optional[datetime.datetime]
]:

    data_grouped = data.groupby(time_series_identifier_column)

    # Create a map of group to map of time-to-values
    # i.e. group_time_value_map[group_id][time_id] = target_value
    group_time_value_map = {
        k: dict(zip(v[time_column].tolist(), v[target_column].tolist()))
        for k, v in data_grouped
    }

    unique_times = sorted(list(set(data[time_column].tolist())))

    data = [
        {
            "name": time.isoformat(),
            **{
                group: time_values_map.get(time)
                for group, time_values_map in group_time_value_map.items()
            },
        }
        for time in unique_times
    ]

    return (
        data,
        unique_times[0].isoformat() if len(unique_times) > 0 else None,
        unique_times[-1].isoformat() if len(unique_times) > 0 else None,
    )


# Get prediction
@app.get("/prediction/{job_id}/{output_type}")
async def prediction(job_id: str, output_type: str):
    job_request = training_jobs_manager_instance.get_request(job_id=job_id)

    if job_request is None:
        raise HTTPException(status_code=404, detail=f"Prediction not found: {job_id}")

    # Fetch dataframes
    try:
        df_history = job_request.dataset.df
        df_prediction = training_jobs_manager_instance.get_prediction(job_id=job_id)
    except Exception as exception:
        logger.error(str(exception))
        raise HTTPException(
            status_code=400, detail=f"There was a problem getting prediction: {job_id}"
        )

    # Fetch training methods
    training_method = training_registry.get(job_request.training_method_id)
    if training_method is None:
        raise HTTPException(
            status_code=404,
            detail=f"Training method not found: {job_request.training_method_id}",
        )

    # Format historical dataframe to match prediction dataframes, according to training method
    history_time_series_identifier_column = (
        training_method.dataset_time_series_identifier_column(job_request=job_request)
    )
    history_time_column = training_method.dataset_time_column(job_request=job_request)
    history_target_column = training_method.dataset_target_column(
        job_request=job_request
    )

    time_series_identifier_column = constants.FORECAST_TIME_SERIES_IDENTIFIER_COLUMN
    time_column = constants.FORECAST_TIME_COLUMN
    target_column = constants.FORECAST_TARGET_COLUMN

    if df_prediction is None:
        raise HTTPException(status_code=404, detail=f"Prediction not found: {job_id}")
    else:
        df_prediction = df_prediction.fillna("")
        # TODO Move the next line to a better place :D
        df_prediction[time_column] = pd.to_datetime(df_prediction[time_column])

        if output_type == "datagrid":
            df_prediction["id"] = df_prediction.index

            return {
                "columns": df_prediction.columns.tolist(),
                "rows": df_prediction.to_dict(orient="records"),
            }
        elif output_type == "chartjs":

            prediction_grouped = df_prediction.groupby(time_series_identifier_column)

            group_time_value_map = {
                k: dict(zip(v[time_column].tolist(), v[target_column].tolist()))
                for k, v in prediction_grouped
            }

            unique_times = sorted(list(df_prediction[time_column].unique()))

            datasets = [
                {
                    "label": group,
                    "data": [time_values_map[time] for time in unique_times],
                }
                for group, time_values_map in group_time_value_map.items()
            ]

            return {
                "timeLabels": unique_times,
                "datasets": datasets,
            }
        elif output_type == "recharts":
            history_formatted, _, history_max_date = format_for_rechart(
                time_series_identifier_column=history_time_series_identifier_column,
                time_column=history_time_column,
                target_column=history_target_column,
                data=df_history,
            )

            (predictions_formatted, _, _,) = format_for_rechart(
                time_series_identifier_column=time_series_identifier_column,
                time_column=time_column,
                target_column=target_column,
                data=df_prediction,
            )

            return {
                "groups": df_prediction[time_series_identifier_column]
                .unique()
                .tolist(),
                "data": history_formatted + predictions_formatted,
                "historyMaxDate": history_max_date,  # The date separating history and prediction
            }
        elif output_type == "plotly":
            column_map = {
                job_request.model_parameters[
                    "timeSeriesIdentifierColumn"
                ]: time_series_identifier_column,
                job_request.model_parameters["timeColumn"]: time_column,
                job_request.model_parameters["targetColumn"]: target_column,
            }

            df_history = df_history.rename(columns=column_map)

            historical_time_values = df_history[time_column]
            history_min_date = (
                historical_time_values.min().isoformat()
                if len(historical_time_values) > 0
                else None
            )
            history_max_date = (
                historical_time_values.max().isoformat()
                if len(historical_time_values) > 0
                else None
            )

            historicalBounds = None
            if history_min_date is not None and history_max_date is not None:
                historicalBounds = {"min": history_min_date, "max": history_max_date}

            df_history = df_history.filter(column_map.values())
            df_prediction = df_prediction.filter(column_map.values())

            lines = format_for_plotly(
                time_series_identifier_column=time_series_identifier_column,
                time_column=time_column,
                target_column=target_column,
                data=pd.concat([df_history, df_prediction]),
            )

            return {
                "lines": lines,
                "historicalBounds": historicalBounds,
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported output type: {output_type}",
            )
