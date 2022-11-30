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

from datetime import datetime, timedelta
from humanize.time import precisedelta
from typing import Any, Dict, Optional

from models import forecast_job_request


class CompletedForecastJob:
    """
    Encapsulates the results of a train-eval-forecast job.
    """

    def __init__(
        self,
        end_time: datetime,
        request: forecast_job_request.ForecastJobRequest,
        model_uri: Optional[str] = None,
        evaluation_uri: Optional[Dict[str, Any]] = None,
        prediction_uri: Optional[Dict[str, Any]] = None,
        error_message: Optional[str] = None,
    ) -> None:
        """The forecast job results.

        Args:
            start_time (datetime.datetime): The request start time.
            start_time (datetime.datetime): The request end time.
            model_uri (Optional[str], optional): The URI to the model. Defaults to None.
            evaluation_uri (Optional[Dict[str, Any]], optional): The BigQuery URI of the evaluation. Defaults to None.
            prediction_uri (Optional[Dict[str, Any]], optional): The BigQuery URI of the prediction. Defaults to None.
            error_message (Optional[str], optional): The error message encountered during training. Defaults to None.
        """
        super().__init__()
        self.end_time = end_time
        self.request = request
        self.model_uri = model_uri
        self.evaluation_uri = evaluation_uri
        self.prediction_uri = prediction_uri
        self.error_message = error_message

    @property
    def duration(self) -> timedelta:
        return self.end_time - self.request.start_time

    def as_response(self) -> Dict:
        return {
            "jobId": self.request.id,
            "request": self.request.as_response(),
            "endTime": self.end_time,
            "errorMessage": self.error_message,
        }
