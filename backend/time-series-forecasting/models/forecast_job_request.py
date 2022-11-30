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

import dataclasses
from datetime import datetime
from typing import Any, Dict
import utils

from models import dataset


@dataclasses.dataclass
class ForecastJobRequest:
    """An encapsulation of the training job request"""

    # The unique key associated with the training method.
    training_method_id: str

    # The display name of with the training method.
    training_method_display_name: str

    # The dataset used for model training.
    dataset: dataset.Dataset

    # The request start time.
    start_time: datetime

    # Parameters for training.
    model_parameters: Dict[str, Any]

    # Parameters for prediction.
    prediction_parameters: Dict[str, Any]

    # The unique request id.
    id: str = dataclasses.field(default_factory=utils.generate_uuid)

    def as_response(self) -> Dict:
        return {
            "jobId": self.id,
            "trainingMethodId": self.training_method_id,
            "trainingMethodName": self.training_method_display_name,
            "dataset": {
                "id": self.dataset.id,
                "icon": self.dataset.icon,
                "displayName": self.dataset.display_name,
            },
            "modelParameters": self.model_parameters,
            "predictionParameters": self.prediction_parameters,
            "startTime": self.start_time,
        }
