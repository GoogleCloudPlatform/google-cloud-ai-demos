# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import random
import subprocess
from typing import List, Optional

import redis
import requests
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint
import google.auth
import google.auth.transport.requests

import logging
import tracer_helper
from services.match_service import (
    CodeInfo,
    Item,
    MatchResult,
    VertexAIMatchingEngineMatchService,
)

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


def encode_texts_to_embeddings(
    access_token: str, sentences: List[str]
) -> List[List[float]]:
    # TODO: Replace with SDK call when it is out.
    ENDPOINT_ID = "8156038716377268224"
    PALM_PROJECT_ID = "678515165750"

    headers = {
        "Authorization": "Bearer " + access_token,
    }

    json_data = {
        "instances": [
            {
                "content": sentence,
            }
            for sentence in sentences
        ],
    }

    response = requests.post(
        f"https://us-central1-staging-prediction-aiplatform.sandbox.googleapis.com/v1/projects/{PALM_PROJECT_ID}/locations/us-central1/endpoints/{ENDPOINT_ID}:predict",
        headers=headers,
        json=json_data,
    )

    if response.status_code != 200:
        logging.error(f"access_token: {access_token}")
        logging.error(response.json())

    return [
        prediction["embeddings"]["values"]
        for prediction in response.json()["predictions"]
    ]


class PalmTextMatchService(VertexAIMatchingEngineMatchService[str]):
    @property
    def id(self) -> str:
        return self._id

    @property
    def name(self) -> str:
        """Name for this service that is shown on the frontend."""
        return self._name

    @property
    def description(self) -> str:
        """Description for this service that is shown on the frontend."""
        return self._description

    @property
    def allows_text_input(self) -> bool:
        """If true, this service allows text input."""
        return True

    @property
    def code_info(self) -> Optional[CodeInfo]:
        """Info about code used to generate index."""
        return self._code_info

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        words_file: str,
        index_endpoint_name: str,
        deployed_index_id: str,
        redis_host: str,  # Redis host to get data about a match id
        redis_port: str,  # Redis port to get data about a match id
        code_info: Optional[CodeInfo] = None,
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self._code_info = code_info

        with open(words_file, "r") as f:
            prompts = f.readlines()
            self.prompts = [prompt.strip() for prompt in prompts]

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port)

    @tracer.start_as_current_span("get_suggestions")
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get suggestions for search queries."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.prompts],
            min(num_items, len(self.prompts)),
        )

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return self.redis_client.get(str(id))

    @tracer.start_as_current_span("get_by_ids")
    def get_by_ids(self, ids: List[str]) -> List[Optional[str]]:
        """Get an item by id."""
        return [self.redis_client.get(str(id)) for id in ids]

    @tracer.start_as_current_span("convert_to_embeddings")
    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        # Get default access token
        creds, _ = google.auth.default()
        # creds.valid is False, and creds.token is None
        # Need to refresh credentials to populate those
        auth_req = google.auth.transport.requests.Request()
        creds.refresh(auth_req)
        access_token = creds.token

        if access_token is None or len(access_token) == 0:
            raise RuntimeError("No access token found")

        return encode_texts_to_embeddings(
            access_token=access_token, sentences=[target]
        )[0]

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = self.get_by_ids(ids=[match.id for match in matches])

        return [
            MatchResult(
                text=item,
                # There is a bug in matching engine where the negative of DOT_PRODUCT_DISTANCE is returned, instead of the distance itself.
                distance=max(0, 1 - match.distance),
                url=f"https://stackoverflow.com/questions/{match.id}",
            )
            for item, match in zip(items, matches)
        ]
