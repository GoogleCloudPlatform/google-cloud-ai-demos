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

from typing import Any, Dict

from google.cloud import bigquery

import constants
import utils
from models import dataset, forecast_job_request
from training_methods import training_method

TIME_COLUMN_PARAMETER = "timeColumn"
TARGET_COLUMN_PARAMETER = "targetColumn"
TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER = "timeSeriesIdentifierColumn"
DATA_FREQUENCY_COLUMN_PARAMETER = "dataFrequency"
FORECAST_HORIZON_PARAMETER = "forecastHorizon"


class BQMLARIMAPlusTrainingMethod(training_method.TrainingMethod):
    """Used to run a BQML ARIMAPlus training job"""

    @property
    def id(self) -> str:
        """A unique id representing this training method.

        Returns:
            str: The id
        """
        return "bqml_arimaplus"

    @property
    def display_name(self) -> str:
        """A display_name representing this training method.

        Returns:
            str: The name
        """
        return "BQML ARIMA+"

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
            str: The model URI
        """

        time_column = model_parameters.get(TIME_COLUMN_PARAMETER)
        target_column = model_parameters.get(TARGET_COLUMN_PARAMETER)
        time_series_id_column = model_parameters.get(
            TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER
        )
        dataFrequency = model_parameters.get(DATA_FREQUENCY_COLUMN_PARAMETER)
        forecast_horizon = prediction_parameters.get(FORECAST_HORIZON_PARAMETER)

        if time_column is None:
            raise ValueError(f"Missing argument: {TIME_COLUMN_PARAMETER}")

        if target_column is None:
            raise ValueError(f"Missing argument: {TARGET_COLUMN_PARAMETER}")

        if time_series_id_column is None:
            raise ValueError(
                f"Missing argument: {TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER}"
            )

        if dataFrequency is None:
            raise ValueError(f"Missing argument: {DATA_FREQUENCY_COLUMN_PARAMETER}")

        if forecast_horizon is None:
            raise ValueError(f"Missing argument: {FORECAST_HORIZON_PARAMETER}")

        # Start training
        query_job = self._train(
            dataset=dataset,
            time_column=time_column,
            target_column=target_column,
            time_series_id_column=time_series_id_column,
            dataFrequency=dataFrequency,
            forecast_horizon=forecast_horizon,
        )

        # Wait for result
        _ = query_job.result()

        return str(query_job.destination)

    def evaluate(self, model: str) -> str:
        """Evaluate a model and return the BigQuery URI to its evaluation table.

        Args:
            model (str): Model to evaluate.

        Returns:
            str: The BigQuery evaluation table URI.
        """

        query_job = self._evaluate(model=model)

        # Wait for result
        _ = query_job.result()

        return str(query_job.destination)

    def predict(
        self,
        dataset: dataset.Dataset,
        model: str,
        model_parameters: Dict[str, Any],
        prediction_parameters: Dict[str, Any],
    ) -> str:
        """Predict using a model and return the BigQuery URI to its prediction table.

        Args:
            dataset (dataset.Dataset): Input dataset.
            model (str): Model to evaluate.
            model_parameters (Dict[str, Any]): The model training parameters.
            prediction_parameters (Dict[str, Any]): The prediction parameters.

        Returns:
            str: The BigQuery prediction table ID.
        """
        query_job = self._predict(
            model=model,
            model_parameters=model_parameters,
            prediction_parameters=prediction_parameters,
        )

        # Wait for result
        _ = query_job.result()

        return str(query_job.destination)

    def _train(
        self,
        dataset: dataset.Dataset,
        time_column: str,
        target_column: str,
        time_series_id_column: str,
        dataFrequency: str,
        forecast_horizon: int,
    ) -> bigquery.QueryJob:
        client = bigquery.Client()
        project_id = client.project
        dataset_id = utils.generate_uuid()

        # Create training dataset in default region
        bq_dataset = bigquery.Dataset(f"{project_id}.{dataset_id}")
        bq_dataset = client.create_dataset(bq_dataset, exists_ok=True)

        bigquery_uri = dataset.get_bigquery_table_id(time_column=time_column)

        query = f"""
            CREATE OR REPLACE MODEL `{project_id}.{dataset_id}.bqml_arima`
            OPTIONS
            (MODEL_TYPE = 'ARIMA_PLUS',
            TIME_SERIES_TIMESTAMP_COL = '{time_column}',
            TIME_SERIES_DATA_COL = '{target_column}',
            TIME_SERIES_ID_COL = '{time_series_id_column}',
            DATA_FREQUENCY = '{dataFrequency}',
            HORIZON = {forecast_horizon}
            ) AS
            SELECT
            {time_column},
            {target_column},
            {time_series_id_column}
            FROM
            `{bigquery_uri}`
        """

        # Start the query job
        return client.query(query)

    def _evaluate(
        self,
        model: str,
    ) -> bigquery.QueryJob:
        client = bigquery.Client()

        query = f"""
            SELECT
            *
            FROM
            ML.ARIMA_EVALUATE(MODEL `{model}`)
        """

        # Start the query job
        return client.query(query)

    def _predict(
        self,
        model: str,
        model_parameters: Dict[str, Any],
        prediction_parameters: Dict[str, Any],
    ) -> bigquery.QueryJob:
        time_series_id_column = model_parameters.get(
            TIME_SERIES_IDENTIFIER_COLUMN_PARAMETER
        )
        forecast_horizon = prediction_parameters.get(FORECAST_HORIZON_PARAMETER)

        if forecast_horizon is None:
            raise ValueError("{FORECAST_HORIZON_PARAMETER} was not provided")

        client = bigquery.Client()

        query = f"""
            SELECT
                {time_series_id_column} as {constants.FORECAST_TIME_SERIES_IDENTIFIER_COLUMN},
                forecast_timestamp as {constants.FORECAST_TIME_COLUMN},
                forecast_value as {constants.FORECAST_TARGET_COLUMN}
            FROM
            ML.FORECAST(MODEL `{model}`,
                        STRUCT({forecast_horizon} AS horizon, 0.8 AS confidence_level))
        """

        # Start the query job
        return client.query(query)
