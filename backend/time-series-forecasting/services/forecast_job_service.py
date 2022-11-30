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

import abc
import datetime
from typing import Any, Dict
import logging

from models import completed_forecast_job, dataset
from models.forecast_job_request import ForecastJobRequest
from training_methods import training_method

logger = logging.getLogger(__name__)


class ForecastJobService:
    """
    This service handles model training, evaluation and prediction.
    """

    def __init__(
        self, training_registry: Dict[str, training_method.TrainingMethod]
    ) -> None:
        """_summary_

        Args:
            training_registry (Dict[str, training_method.TrainingMethod]): _description_
        """
        super().__init__()

        # TODO: Register training methods
        self._training_registry = training_registry

    def run(
        self, request: ForecastJobRequest
    ) -> completed_forecast_job.CompletedForecastJob:
        """Run model training, evaluation and prediction for a given `training_method_name`. Waits for completion.

        Args:
            training_method_name (str): The training method name as defined in the training registry.
            start_time (datetime.datetime): Start time of job.
            dataset (dataset.Dataset): The dataset used for training.
            model_parameters (Dict[str, Any]): The parameters for training.
            prediction_parameters (Dict[str, Any]): The paramters for prediction.

        Raises:
            ValueError: Any error that happens during training, evaluation or prediction.

        Returns:
            forecast_job_result.ForecastJobResult: The results containing the URIs for each step.
        """
        training_method = self._training_registry.get(request.training_method_id)

        # Start training
        output = completed_forecast_job.CompletedForecastJob(
            end_time=datetime.datetime.now(datetime.timezone.utc),  # Placeholder time
            request=request,
            model_uri=None,
            error_message=None,
        )

        try:
            if training_method is None:
                raise ValueError(
                    f"Training method '{request.training_method_id}' is not supported"
                )

            # Train model
            output.model_uri = training_method.train(
                dataset=request.dataset,
                model_parameters=request.model_parameters,
                prediction_parameters=request.prediction_parameters,
            )

            # Run evaluation
            output.evaluation_uri = training_method.evaluate(model=output.model_uri)

            # Run prediction
            output.prediction_uri = training_method.predict(
                dataset=request.dataset,
                model=output.model_uri,
                model_parameters=request.model_parameters,
                prediction_parameters=request.prediction_parameters,
            )
        except Exception as exception:
            logger.error(str(exception))
            output.error_message = str(exception)
        finally:
            output.end_time = datetime.datetime.now(datetime.timezone.utc)

        return output
