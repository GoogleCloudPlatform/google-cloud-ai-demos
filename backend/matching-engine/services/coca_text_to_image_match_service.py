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

import requests
from google.cloud.aiplatform.matching_engine import \
    matching_engine_index_endpoint

import tracer_helper
from services.match_service import (CodeInfo, Item, MatchResult,
                                    VertexAIMatchingEngineMatchService)

tracer = tracer_helper.get_tracer(__name__)


def encode_texts_to_embeddings_with_retry(
    access_token: str, api_key: str, text: List[str]
) -> List[List[float]]:
    headers = {
        "Authorization": "Bearer " + access_token,
    }

    json_data = {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri": "https://fileinfo.com/img/ss/xl/jpeg_43.png"  # dummy image
                    }
                },
                "features": [{"type": "IMAGE_EMBEDDING"}],
                "imageContext": {"imageEmbeddingParams": {"contextualTexts": text}},
            }
        ]
    }

    response = requests.post(
        f"https://us-vision.googleapis.com/v1/images:annotate?key={api_key}",
        headers=headers,
        json=json_data,
    )

    try:
        return response.json()["responses"][0]["imageEmbeddingVector"][
            "contextualTextEmbeddingVectors"
        ]
    except Exception as ex:
        # print(f"{ex}:{response.json()}")
        print(ex)
        raise RuntimeError("Error getting embedding.")


class CocaTextToImageMatchService(VertexAIMatchingEngineMatchService[str]):
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
        prompts_file: str,
        index_endpoint_name: str,
        deployed_index_id: str,
        image_directory_uri: str,
        api_key: str,
        code_info: Optional[CodeInfo],
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self.image_directory_uri = image_directory_uri
        self._code_info = code_info
        self.api_key = api_key

        with open(prompts_file, "r") as f:
            prompts = f.readlines()
            self.prompts = [prompt.strip() for prompt in prompts]

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

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
        return f"{self.image_directory_uri}/{id}"

    @tracer.start_as_current_span("convert_to_embeddings")
    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        access_token = subprocess.run(
            "gcloud auth print-access-token", shell=True, capture_output=True, text=True
        ).stdout.strip()

        return encode_texts_to_embeddings_with_retry(
            access_token=access_token, api_key=self.api_key, text=[target]
        )[0]

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]
        return [
            MatchResult(text=None, distance=match.distance, image=item)
            if item is not None
            else None
            for item, match in zip(items, matches)
        ]
