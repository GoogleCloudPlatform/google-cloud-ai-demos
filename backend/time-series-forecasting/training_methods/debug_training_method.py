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

import time

import utils
from models import dataset, forecast_job_request
from training_methods import training_method

MAX_DELAY_IN_SECONDS = 60


class DebugTrainingMethod(training_method.TrainingMethod):
    """Used to run a dummy training job for integration testing as the actual jobs can take a long time.

    It can wait a specified number of seconds or error out, depending on the parameters passed to it.
    """

    @property
    def id(self) -> str:
        """A unique id representing this training method.

        Returns:
            str: The id
        """

        return "debug"

    @property
    def display_name(self) -> str:
        """A display_name representing this training method.

        Returns:
            str: The name
        """
        return "Debug"

    def dataset_time_series_identifier_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:
        """The column representing the time series identifier variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return "time_series_identifier"

    def dataset_time_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:
        """The column representing the time variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return "time"

    def dataset_target_column(
        self, job_request: forecast_job_request.ForecastJobRequest
    ) -> str:
        """The column representing the target variable in the dataset dataframe.

        Returns:
            str: The column name
        """
        return "target"

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

        # Sleep for a specified delay, not more than a max.
        delay_in_seconds = min(
            model_parameters.get("delayInSeconds", 5), MAX_DELAY_IN_SECONDS
        )

        time.sleep(delay_in_seconds)

        error_message = model_parameters.get("errorMessage")

        if error_message:
            raise ValueError(error_message)

        return "debug.model"

    def evaluate(self, model: str) -> str:
        """Evaluate a model and return the BigQuery URI to its evaluation table.

        Args:
            model (str): Model to evaluate.

        Returns:
            str: The BigQuery evaluation table URI.
        """

        return "debug.evaluation"

    def predict(
        self,
        model: str,
        model_parameters: Dict[str, Any],
        prediction_parameters: Dict[str, Any],
    ) -> str:
        """Predict using a model and return the BigQuery URI to its prediction table.

        Args:
            model (str): Model to evaluate.
            model_parameters (Dict[str, Any]): The model training parameters.
            prediction_parameters (Dict[str, Any]): The prediction parameters.

        Returns:
            str: The BigQuery prediction table URI.
        """

        return "debug.prediction"
