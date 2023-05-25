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

import logging
import random
from typing import Dict, List, Optional

import google.auth
import google.auth.transport.requests
import redis
import requests
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint

import tracer_helper
from services.match_service import (
    CodeInfo,
    Item,
    MatchResult,
    VertexAIMatchingEngineMatchService,
)

# Load the "Vertex AI Embeddings for Text" model
from vertexai.preview.language_models import TextEmbeddingModel

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


class PalmTextMatchService(VertexAIMatchingEngineMatchService[Dict[str, str]]):
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
    def allows_image_upload(self) -> bool:
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
        redis_port: int,  # Redis port to get data about a match id
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
        self.model: TextEmbeddingModel = TextEmbeddingModel.from_pretrained(
            "textembedding-gecko@001"
        )

    @tracer.start_as_current_span("get_suggestions")
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get suggestions for search queries."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.prompts],
            min(num_items, len(self.prompts)),
        )

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[Dict[str, str]]:
        """Get an item by id."""
        retrieved = self.redis_client.hgetall(str(id))

        if retrieved is not None:
            # Convert the byte strings to regular strings
            return {key.decode(): value.decode() for key, value in retrieved.items()}
        else:
            return None

    def encode_texts_to_embeddings(self, sentences: List[str]) -> List[List[float]]:
        embeddings = self.model.get_embeddings(sentences)
        return [embedding.values for embedding in embeddings]

    @tracer.start_as_current_span("convert_text_to_embeddings")
    def convert_text_to_embeddings(self, target: str) -> Optional[List[float]]:
        return self.encode_texts_to_embeddings(sentences=[target])[0]

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]

        return [
            MatchResult(
                title=item["title"],
                # There is a bug in matching engine where the negative of DOT_PRODUCT_DISTANCE is returned, instead of the distance itself.
                distance=max(0, 1 - match.distance),
                description=item["body"] + "...",
                url=f"https://stackoverflow.com/questions/{match.id}",
            )
            if item is not None and len(item.items()) > 0
            else None
            for item, match in zip(items, matches)
        ]
