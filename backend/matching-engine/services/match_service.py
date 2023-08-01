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

import abc
import dataclasses
import functools
import logging
from typing import Generic, List, Optional, TypeVar

from google.cloud.aiplatform.matching_engine import (
    matching_engine_index,
    matching_engine_index_endpoint,
)

import tracer_helper

T = TypeVar("T")

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


@dataclasses.dataclass
class MatchResult:
    distance: float
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None


@dataclasses.dataclass
class Item:
    text: str
    id: Optional[str]
    image: Optional[str]


@dataclasses.dataclass
class CodeInfo:
    url: str
    title: str


class MatchService(abc.ABC, Generic[T]):
    @abc.abstractproperty
    def id(self) -> str:
        """Unique identifier for this service."""
        pass

    @abc.abstractproperty
    def name(self) -> str:
        """Name for this service that is shown on the frontend."""
        pass

    @abc.abstractproperty
    def description(self) -> str:
        """Description for this service that is shown on the frontend."""
        pass

    @property
    def allows_text_input(self) -> bool:
        """If true, this service allows text input."""
        return False

    @property
    def allows_image_input(self) -> bool:
        """If true, this service allows text input."""
        return False

    @property
    def code_info(self) -> Optional[CodeInfo]:
        """Info about code used to generate index."""
        return None

    def convert_image_to_embeddings(
        self, image_file_local_path: str
    ) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        raise NotImplementedError()

    def convert_image_to_embeddings_remote(
        self, image_file_remote_path: str
    ) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        raise NotImplementedError()

    def match_by_image(
        self, image_file_local_path: str, num_neighbors: int
    ) -> List[MatchResult]:
        raise NotImplementedError()

    def match_by_image_remote(
        self, image_file_remote_path: str, num_neighbors: int
    ) -> List[MatchResult]:
        raise NotImplementedError()

    @abc.abstractmethod
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get suggestions for search queries."""
        pass

    @abc.abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        """Get an item by id."""
        pass

    @abc.abstractmethod
    def get_total_index_count(self) -> int:
        """Get total index count."""
        pass

    @abc.abstractmethod
    def convert_text_to_embeddings(self, target: str) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        pass

    @abc.abstractmethod
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        pass

    @abc.abstractmethod
    def match_by_text(self, target: str, num_neighbors: int) -> List[MatchResult]:
        pass


class VertexAIMatchingEngineMatchService(MatchService[T]):
    index_endpoint: matching_engine_index_endpoint.MatchingEngineIndexEndpoint
    deployed_index_id: str
    is_public_index_endpoint: bool = True

    @tracer.start_as_current_span("match_by_embeddings")
    def match_by_embeddings(
        self, embeddings: List[float], num_neighbors: int
    ) -> List[MatchResult]:
        if embeddings is None:
            raise ValueError("Embeddings could not be generated for: {target}")

        logger.info(f"len(embeddings) = {len(embeddings)}")

        if self.is_public_index_endpoint:
            response = self.index_endpoint.find_neighbors(
                deployed_index_id=self.deployed_index_id,
                queries=[embeddings],
                num_neighbors=num_neighbors,
            )
        else:
            response = self.index_endpoint.match(
                deployed_index_id=self.deployed_index_id,
                queries=[embeddings],
                num_neighbors=num_neighbors,
            )

        logger.info(f"index_endpoint.match completed")

        matches_all = self.convert_match_neighbors_to_result(
            matches=[match for matches in response for match in matches]
        )

        logger.info(f"matches converted")

        matches_all_nonoptional: List[MatchResult] = [
            match for match in matches_all if match is not None
        ]

        logger.info(f"matches none filtered")

        return matches_all_nonoptional

    @tracer.start_as_current_span("match_by_text")
    def match_by_text(self, target: str, num_neighbors: int) -> List[MatchResult]:
        logger.info(f"match_by_text(target={target}, num_neighbors={num_neighbors})")

        embeddings = self.convert_text_to_embeddings(target=target)

        if embeddings is None:
            raise ValueError("Embeddings could not be generated for: {target}")

        return self.match_by_embeddings(
            embeddings=embeddings, num_neighbors=num_neighbors
        )

    @tracer.start_as_current_span("match_by_image")
    def match_by_image(
        self, image_file_local_path: str, num_neighbors: int
    ) -> List[MatchResult]:
        logger.info(
            f"match_by_image(target={image_file_local_path}, num_neighbors={num_neighbors})"
        )

        embeddings = self.convert_image_to_embeddings(
            image_file_local_path=image_file_local_path
        )

        if embeddings is None:
            raise ValueError(
                "Embeddings could not be generated for: {image_file_local_path}"
            )

        return self.match_by_embeddings(
            embeddings=embeddings, num_neighbors=num_neighbors
        )

    @tracer.start_as_current_span("match_by_image_remote")
    def match_by_image_remote(
        self, image_file_remote_path: str, num_neighbors: int
    ) -> List[MatchResult]:
        logger.info(
            f"match_by_image(target={image_file_remote_path}, num_neighbors={num_neighbors})"
        )

        embeddings = self.convert_image_to_embeddings_remote(
            image_file_remote_path=image_file_remote_path
        )

        if embeddings is None:
            raise ValueError(
                "Embeddings could not be generated for: {image_file_local_path}"
            )

        return self.match_by_embeddings(
            embeddings=embeddings, num_neighbors=num_neighbors
        )

    @functools.lru_cache
    @tracer.start_as_current_span("get_total_index_count")
    def get_total_index_count(self) -> int:
        return sum(
            [
                matching_engine_index.MatchingEngineIndex(
                    deployed_index.index
                )._gca_resource.index_stats.vectors_count
                for deployed_index in self.index_endpoint.deployed_indexes
            ]
        )
