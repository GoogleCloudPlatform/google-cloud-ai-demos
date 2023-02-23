import abc
import dataclasses
import functools
import numpy as np
from typing import Any, Generic, List, Optional, Tuple, TypeVar
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index,
    matching_engine_index_endpoint,
)
import random

import spacy

NUM_ITEMS = 60

T = TypeVar("T")


@dataclasses.dataclass
class MatchResult:
    text: str
    distance: float
    image: Optional[str] = None


@dataclasses.dataclass
class Item:
    id: str
    text: str
    image: Optional[str]


class MatchService(abc.ABC, Generic[T]):
    @abc.abstractproperty
    def id(str) -> str:
        """Unique identifier for this service."""
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Item]:
        """Get all existing ids and items."""
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
    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        pass

    @abc.abstractmethod
    def convert_match_neighbor_to_result(
        self, match: matching_engine_index_endpoint.MatchNeighbor
    ) -> Optional[MatchResult]:
        pass

    @abc.abstractmethod
    def match(self, target: str, num_neighbors: int) -> List[MatchResult]:
        pass


class VertexAIMatchingEngineMatchService(MatchService[T]):
    index_endpoint: matching_engine_index_endpoint.MatchingEngineIndexEndpoint
    deployed_index_id: str

    def match(self, target: str, num_neighbors: int) -> List[MatchResult]:
        embeddings = self.convert_to_embeddings(target=target)

        if embeddings is None:
            raise ValueError("Embeddings could not be generated for: {target}")

        response = self.index_endpoint.match(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings],
            num_neighbors=num_neighbors,
        )

        matches_all = [
            self.convert_match_neighbor_to_result(match=match)
            for matches in response
            for match in matches
        ]

        matches_all_nonoptional: List[MatchResult] = [
            match for match in matches_all if match is not None
        ]

        return sorted(matches_all_nonoptional, key=lambda x: x.distance, reverse=False)


# class ImageMatchService(MatchService[models.Image]):
#     id = "Images"

#     def __init__(self, index_endpoint_name: str, deployed_index_id: str) -> None:
#         self.index_endpoint = (
#             matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
#                 index_endpoint_name=index_endpoint_name
#             )
#         )
#         self.deployed_index_id = deployed_index_id

#     def get_all(self) -> List[Item]:
#         """Get all existing ids and items."""
#         return []

#     def get_by_id(self, id: str) -> Optional[T]:
#         """Get an item by id."""
#         return None

#     def convert_to_embeddings(self, target: str) -> List[float]:
#         return []  # TODO

#     def match(
#         self, target: models.Image, num_neighbors: int
#     ) -> List[MatchResult]:
#         embeddings = self.convert_to_embeddings(target=target)

#         response = self.index_endpoint.match(
#             deployed_index_id=self.deployed_index_id,
#             queries=[embeddings],
#             num_neighbors=num_neighbors,
#         )

#         matches_all = [match for matches in response for match in matches]

#         return sorted(matches_all, key=lambda x: x.distance, reverse=True)


class TextMatchService(VertexAIMatchingEngineMatchService[str]):
    @property
    def id(self) -> str:
        return self._id

    def __init__(
        self, id: str, words_file: str, index_endpoint_name: str, deployed_index_id: str
    ) -> None:
        self._id = id
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

    def get_all(self) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.words], NUM_ITEMS
        )

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return id

    @functools.lru_cache
    def get_total_index_count(self) -> int:
        return sum(
            [
                matching_engine_index.MatchingEngineIndex(
                    deployed_index.index
                )._gca_resource.index_stats.vectors_count
                for deployed_index in self.index_endpoint.deployed_indexes
            ]
        )

    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = np.array(self.nlp.vocab[target].vector.tolist())

        if np.any(vector):
            return vector.tolist()
        else:
            return None

    def convert_match_neighbor_to_result(
        self, match: matching_engine_index_endpoint.MatchNeighbor
    ) -> Optional[MatchResult]:
        item = self.get_by_id(match.id)
        if item is not None:
            return MatchResult(text=item, distance=match.distance)
        else:
            return None
