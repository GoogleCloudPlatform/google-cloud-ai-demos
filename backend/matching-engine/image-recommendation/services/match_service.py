import abc
import dataclasses
import functools
import logging

from typing import Any, Generic, List, Optional, Tuple, TypeVar

from google.cloud.aiplatform.matching_engine import (
    matching_engine_index,
    matching_engine_index_endpoint,
)

T = TypeVar("T")

logger = logging.getLogger(__name__)


@dataclasses.dataclass
class MatchResult:
    distance: float
    text: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None


@dataclasses.dataclass
class Item:
    text: str
    id: Optional[str]
    image: Optional[str]


class MatchService(abc.ABC, Generic[T]):
    @abc.abstractproperty
    def id(self) -> str:
        """Unique identifier for this service."""
        pass

    @property
    def allows_text_input(self) -> bool:
        """If true, this service allows text input."""
        return False

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
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        pass

    @abc.abstractmethod
    def match(self, target: str, num_neighbors: int) -> List[MatchResult]:
        pass


class VertexAIMatchingEngineMatchService(MatchService[T]):
    index_endpoint: matching_engine_index_endpoint.MatchingEngineIndexEndpoint
    deployed_index_id: str
    reverse_scores: bool = False

    def match(self, target: str, num_neighbors: int) -> List[MatchResult]:
        logger.info(f"match(target={target}, num_neighbors={num_neighbors})")

        embeddings = self.convert_to_embeddings(target=target)

        if embeddings is None:
            raise ValueError("Embeddings could not be generated for: {target}")

        logger.info(f"len(embeddings) = {len(embeddings)}")

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

        matches_sorted = sorted(
            matches_all_nonoptional,
            key=lambda x: x.distance,
            reverse=self.reverse_scores,
        )

        logger.info(f"matches sorted")

        return matches_sorted

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
