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
from typing import List, Optional

import numpy as np
import spacy
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint
from services.match_service import CodeInfo, Item, MatchResult, VertexAIMatchingEngineMatchService

import tracer_helper
tracer = tracer_helper.get_tracer(__name__)

class SpacyTextMatchService(VertexAIMatchingEngineMatchService[str]):
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
        return False

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
        code_info: Optional[CodeInfo]
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self._code_info = code_info

        with open(words_file, "r") as f:
            words = f.readlines()
            self.words = [word.strip() for word in words]

        self.nlp = spacy.load("en_core_web_md")

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

    @tracer.start_as_current_span("get_all")
    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.words],
            min(num_items, len(self.words)),
        )

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return id

    @tracer.start_as_current_span("convert_to_embeddings")
    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = np.array(self.nlp.vocab[target].vector.tolist())

        if np.any(vector):
            return vector.tolist()
        else:
            return None

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]
        return [
            MatchResult(text=item, distance=match.distance)
            if item is not None
            else None
            for item, match in zip(items, matches)
        ]
