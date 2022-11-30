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

from tokenize import Double
from typing import Any, Dict, List, Optional
import pandas as pd
import numpy as np

from google.cloud import aiplatform, bigquery
from google.cloud.aiplatform import models

import utils
from models import dataset, forecast_job_request
from training_methods import training_method
import constants


TIME_COLUMN_PARAMETER = "timeColumn"
TARGET_COLUMN_PARAMETER = "targetColumn"
TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER = "timeSeriesIdentifierColumn"
FORECAST_HORIZON_PARAMETER = "forecastHorizon"
DATA_GRANULARITY_UNIT_PARAMETER = "dataGranularityUnit"
DATA_GRANULARITY_COUNT_PARAMETER = "dataGranularityCount"
OPTIMIZATION_OBJECTIVE_PARAMETER = "optimizationObjective"
COLUMN_SPECS_PARAMETER = "columnSpecs"
TIME_SERIES_ATTRIBUTE_COLUMNS_PARAMETER = "timeSeriesAttributeColumns"
CONTEXT_WINDOW_PARAMETER = "contextWindow"


class AutoMLForecastingTrainingMethod(training_method.TrainingMethod):
    def __init__(self) -> None:
        super().__init__()
        aiplatform.init()
        
    @property
    def id(self) -> str:
        """A unique id representing this training method.

        Returns:
            str: The id
        """
        return "automl-forecasting"

    @property
    def display_name(self) -> str:
        """A display_name representing this training method.

        Returns:
            str: The name
        """
        return "Vertex AI AutoML Forecasting"

    def dataset_time_series_identifier_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:

        """The column representing the time series identifier variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return job_request.model_parameters[TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER]

    def dataset_time_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:
        """The column representing the time variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return job_request.model_parameters[TIME_COLUMN_PARAMETER]

    def dataset_target_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:
        """The column representing the target variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return job_request.model_parameters[TARGET_COLUMN_PARAMETER]

    def train(
        self,
        dataset: dataset.Dataset,
        model_parameters: Dict[str, Any],
        prediction_parameters: Dict[str, Any],
    ) -> str:
        """Train a job and return the model URI.

        Args:
            dataset (dataset.Dataset): Input dataset.
            model_parameters (Dict[str, Any]): The model training parameters.
            prediction_parameters (Dict[str, Any]): The prediction parameters.

        Returns:
            str: The model resource name
        """

        time_column = model_parameters.get(TIME_COLUMN_PARAMETER)
        target_column = model_parameters.get(TARGET_COLUMN_PARAMETER)
        column_specs = model_parameters.get(COLUMN_SPECS_PARAMETER)
        time_series_id_column = model_parameters.get(
            TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER
        )
        data_granularity_unit = model_parameters.get(DATA_GRANULARITY_UNIT_PARAMETER)
        data_granularity_count = model_parameters.get(DATA_GRANULARITY_COUNT_PARAMETER)
        optimization_objective = model_parameters.get(OPTIMIZATION_OBJECTIVE_PARAMETER)
        time_series_attribute_columns = model_parameters.get(
            TIME_SERIES_ATTRIBUTE_COLUMNS_PARAMETER
        )
        forecast_horizon = prediction_parameters.get(FORECAST_HORIZON_PARAMETER)

        if time_column is None:
            raise ValueError(f"Missing argument: {TIME_COLUMN_PARAMETER}")

        if target_column is None:
            raise ValueError(f"Missing argument: {TARGET_COLUMN_PARAMETER}")

        if time_series_id_column is None:
            raise ValueError(
                f"Missing argument: {TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER}"
            )

        if forecast_horizon is None:
            raise ValueError(f"Missing argument: {FORECAST_HORIZON_PARAMETER}")

        if data_granularity_unit is None:
            raise ValueError(f"Missing argument: {DATA_GRANULARITY_UNIT_PARAMETER}")

        if data_granularity_count is None:
            raise ValueError(f"Missing argument: {DATA_GRANULARITY_COUNT_PARAMETER}")

        # Start training
        model = self._train(
            dataset=dataset,
            time_column=time_column,
            target_column=target_column,
            time_series_id_column=time_series_id_column,
            forecast_horizon=forecast_horizon,
            data_granularity_unit=data_granularity_unit,
            data_granularity_count=data_granularity_count,
            optimization_objective=optimization_objective,
            column_specs=column_specs,
            time_series_attribute_columns=time_series_attribute_columns,
        )

        return model.resource_name

    def evaluate(self, model: str) -> str:
        """Evaluate a model and return the BigQuery table ID to its evaluation
        table.

        Args:
            model (str): Model to evaluate.

        Returns:
            str: The BigQuery evaluation table ID.
        """

        table_id = self._evaluate(model_name=model)

        return table_id

    def predict(
        self,
        dataset: dataset.Dataset,
        model: str,
        model_parameters: Dict[str, Any],
        prediction_parameters: Dict[str, Any],
    ) -> str:
        """Predict using a model and return the BigQuery table ID to its prediction
        table.

        Args:
            dataset (dataset.Dataset): Input dataset.
            model (str): Model to evaluate.
            model_parameters (Dict[str, Any]): The model training parameters.
            prediction_parameters (Dict[str, Any]): The prediction parameters.

        Returns:
            str: The BigQuery prediction table view ID.
        """
        forecast_horizon = prediction_parameters.get(FORECAST_HORIZON_PARAMETER)
        context_window = prediction_parameters.get(CONTEXT_WINDOW_PARAMETER)
        time_column = model_parameters.get(TIME_COLUMN_PARAMETER)
        time_series_id_column = model_parameters.get(
            TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER
        )
        target_column_name = model_parameters.get(TARGET_COLUMN_PARAMETER)

        if forecast_horizon is None:
            raise ValueError(f"Missing argument: {FORECAST_HORIZON_PARAMETER}")

        if context_window is None:
            raise ValueError(f"Missing argument: {CONTEXT_WINDOW_PARAMETER}")

        if time_column is None:
            raise ValueError(f"Missing argument: {TIME_COLUMN_PARAMETER}")

        if time_series_id_column is None:
            raise ValueError(f"Missing argument: {TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER}")

        if target_column_name is None:
            raise ValueError(f"Missing argument: {TARGET_COLUMN_PARAMETER}")

        # Get test data BigQuery source uri
        test_bq_source_id = dataset.get_bigquery_table_id(
            time_column=time_column, dataset_portion="test"
        )

        processed_dataset_bq_source = self._prepare_test_dataset(
            context_window=context_window,
            forecast_horizon=forecast_horizon,
            model_parameters=model_parameters,
            bigquery_source=f"bq://{test_bq_source_id}",
        )

        prediction_table_id = self._predict(
            model_name=model, bigquery_source=processed_dataset_bq_source
        )

        # Get the prediction dataset id
        prediction_dataset_id = ""
        if prediction_table_id is None:
            raise ValueError("Prediction table id is null!")
        else:
            prediction_dataset_id = prediction_table_id.split(".")[1]

        # Create a view and rename column names in the prediction table
        client = bigquery.Client()
        view_id = f"{client.project}.{prediction_dataset_id}.{utils.generate_uuid()}"
        view = bigquery.Table(view_id)

        view.view_query = f"""
            SELECT
              {time_series_id_column} as
                {constants.FORECAST_TIME_SERIES_IDENTIFIER_COLUMN},
              {time_column} as {constants.FORECAST_TIME_COLUMN},
              predicted_{target_column_name} as {constants.FORECAST_TARGET_COLUMN}
            FROM `{prediction_table_id}`"""

        client.create_table(view)

        return view_id

    def _train(
        self,
        dataset: dataset.Dataset,
        time_column: str,
        target_column: str,
        time_series_id_column: str,
        forecast_horizon: int,
        data_granularity_unit: str,
        data_granularity_count: int,
        optimization_objective: Optional[str] = None,
        column_specs: Optional[Dict[str, str]] = None,
        time_series_attribute_columns: Optional[List[str]] = None,
    ) -> models.Model:

        uuid = utils.generate_uuid()

        # Get training data BigQuery source uri
        train_bq_source = dataset.get_bigquery_table_id(
            time_column=time_column, dataset_portion="train"
        )
        train_bq_source = f"bq://{train_bq_source}"

        # Create Vertex AI time series dataset
        timeseries_dataset = aiplatform.TimeSeriesDataset.create(
            display_name=f"timeseries_{uuid}",
            bq_source=train_bq_source,
        )

        # Create AutoML forecasting training job
        training_job = aiplatform.AutoMLForecastingTrainingJob(
            display_name=f"automl-job-{uuid}",
            optimization_objective=optimization_objective,
            column_specs=column_specs,
        )

        # Start running the training pipeline
        model = training_job.run(
            dataset=timeseries_dataset,
            target_column=target_column,
            time_column=time_column,
            time_series_identifier_column=time_series_id_column,
            available_at_forecast_columns=[time_column],
            unavailable_at_forecast_columns=[target_column],
            time_series_attribute_columns=time_series_attribute_columns,
            forecast_horizon=forecast_horizon,
            data_granularity_unit=data_granularity_unit,
            data_granularity_count=data_granularity_count,
            model_display_name=f"automl-{uuid}",
        )

        return model

    def _evaluate(self, model_name: str) -> str:

        # Get the model resource
        model = aiplatform.Model(model_name=model_name)

        # check if there us eval item
        if len(model.list_model_evaluations()) > 0:
            # Parse evaluation data
            model_evaluations = model.list_model_evaluations()[0].to_dict()
            evaluation_metrics = model_evaluations["metrics"]

            evaluation_metrics_df = pd.DataFrame(
                evaluation_metrics.items(), columns=["metric", "value"]
            )

            # Construct a BigQuery client object.
            client = bigquery.Client()
            project_id = client.project
            dataset_id = utils.generate_uuid()

            # Create evaluation dataset in default region
            bq_dataset = bigquery.Dataset(f"{project_id}.{dataset_id}")
            bq_dataset = client.create_dataset(bq_dataset, exists_ok=True)

            # Create a bq table in the dataset and upload the evaluation metrics
            table_id = f"{project_id}.{dataset_id}.automl-evaluation"

            job_config = bigquery.LoadJobConfig(
                # The schema is used to assist in data type definitions.
                schema=[
                    bigquery.SchemaField("metric", bigquery.enums.SqlTypeNames.STRING),
                    bigquery.SchemaField("value", bigquery.enums.SqlTypeNames.FLOAT64),
                ],
                # Optionally, set the write disposition. BigQuery appends loaded rows
                # to an existing table by default, but with WRITE_TRUNCATE write
                # disposition it replaces the table with the loaded data.
                write_disposition="WRITE_TRUNCATE",
            )

            job = client.load_table_from_dataframe(
                dataframe=evaluation_metrics_df,
                destination=table_id,
                job_config=job_config,
            )
            # Wait for the job to complete.
            _ = job.result()

            return str(job.destination)
        else:
            raise ValueError(
                f"Model evaluation data does not exist for model {model_name}!"
            )

    def _predict(self, model_name: str, bigquery_source: str) -> str:
        """This function runs the batch prediction job

        Args:
            model_name (str): The model used for batch prediciton.
            bigquery_source (str): The BigQuery source URI for batch prediction.

        Returns:
            str: The table id of batch prediction results.
        """

        client = bigquery.Client()
        project_id = client.project

        model = aiplatform.Model(model_name=model_name)

        job = model.batch_predict(
            job_display_name=f"automl_forecasting_{utils.generate_uuid()}",
            bigquery_source=bigquery_source,
            instances_format="bigquery",
            bigquery_destination_prefix=f"bq://{project_id}",
            predictions_format="bigquery",
            generate_explanation=True,
            sync=True,
        )

        output_dataset = job.output_info.bigquery_output_dataset
        output_dataset = output_dataset.replace("bq://", "")
        output_table = job.output_info.bigquery_output_table
        bq_output_table_id = f"{output_dataset}.{output_table}"

        return bq_output_table_id

    def _prepare_test_dataset(
        self,
        context_window: int,
        forecast_horizon: int,
        model_parameters: Dict[str, Any],
        bigquery_source: str,
    ) -> str:
        """This function does the prerocessing job on the test data and
        saves the result in a BigQuery table

        Args:
            context_window (int): Sets how far back the model looks during training
              (and for forecasts).
            forecast_horizon (int): Determines how far into the future the model
              forecasts the target value for each row of prediction data.
            model_parameters (Dict[str, Any]): The model training parameters.
            bigquery_source (str): BigQuery uri of the table to be processed in
              format bq://project-id.dataset-id.table-id

        Returns:
            str: BigQuery uri of the destination table where the preprocess data is
              saved to in format bq://project-id.dataset-id.table-id
        """

        time_column = model_parameters.get(TIME_COLUMN_PARAMETER)
        target_column = model_parameters.get(TARGET_COLUMN_PARAMETER)

        if time_column is None:
            raise ValueError(f"Missing argument: {TIME_COLUMN_PARAMETER}")

        if target_column is None:
            raise ValueError(f"Missing argument: {TARGET_COLUMN_PARAMETER}")

        # Download dataset from BigQuery
        df_test = utils.download_bq_table(bq_table_uri=bigquery_source)
        df_test.sort_values(by=time_column, inplace=True)
        df_test[time_column] = pd.to_datetime(df_test[time_column]).dt.normalize()
        start_date = df_test.iloc[0][time_column]

        # Store start and end dates for context and horizon
        date_context_window_start = start_date
        date_context_window_end = start_date + np.timedelta64(context_window, "D")
        time_horizon_end = date_context_window_end + np.timedelta64(
            forecast_horizon, "D"
        )

        # Extract dataframes for context and horizon
        df_test_context = df_test[
            (df_test[time_column] >= date_context_window_start)
            & (df_test[time_column] < date_context_window_end)
        ]
        df_test_horizon = df_test[
            (df_test[time_column] >= date_context_window_end)
            & (df_test[time_column] < time_horizon_end)
        ].copy()

        # Remove target for horizon (i.e. future dates)
        df_test_horizon[target_column] = None

        # Write test data to CSV
        df_test = pd.concat([df_test_context, df_test_horizon])

        # Load the data to BigQuery
        destination_table = utils.save_dataframe_to_bigquery(
            dataframe=df_test, table_name="processed-test-data"
        )
        bq_uri = f"bq://{destination_table}"

        return bq_uri
