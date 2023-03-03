import abc
import dataclasses
import functools

from typing import Any, Generic, List, Optional, Tuple, TypeVar

from google.cloud.aiplatform.matching_engine import (
    matching_engine_index,
    matching_engine_index_endpoint,
)

T = TypeVar("T")


@dataclasses.dataclass
class MatchResult:
    text: str
    distance: float
    url: Optional[str] = None
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
    def get_all(self, num_items: int = 60) -> List[Item]:
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
