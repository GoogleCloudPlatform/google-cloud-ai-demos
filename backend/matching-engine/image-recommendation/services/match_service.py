import abc
from typing import Any, Generic, List, Optional, Tuple, TypeVar
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index_endpoint,
)
import models

import spacy

T = TypeVar("T")


class MatchService(abc.ABC, Generic[T]):
    @abc.abstractproperty
    def id(str) -> str:
        """Unique identifier for this service."""
        pass

    @abc.abstractmethod
    def get_all(self) -> List[Tuple[str, T]]:
        """Get all existing ids and items."""
        pass

    @abc.abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        """Get an item by id."""
        pass

    @abc.abstractmethod
    def convert_to_embeddings(self, target: str) -> List[float]:
        """Convert a given item to an embedding representation."""
        pass

    @abc.abstractmethod
    def match(
        self, target: T, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        pass


class ImageMatchService(MatchService[models.Image]):
    id = "Images"

    def __init__(self, index_endpoint_name: str, deployed_index_id: str) -> None:
        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

    def get_all(self) -> List[Tuple[str, T]]:
        """Get all existing ids and items."""
        return []

    def get_by_id(self, id: str) -> Optional[T]:
        """Get an item by id."""
        return None

    def convert_to_embeddings(self, target: str) -> List[float]:
        return []  # TODO

    def match(
        self, target: models.Image, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        embeddings = self.convert_to_embeddings(target=target)

        response = self.index_endpoint.match(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings],
            num_neighbors=num_neighbors,
        )

        matches_all = [match for matches in response for match in matches]

        return sorted(matches_all, key=lambda x: x.distance, reverse=True)


class TextMatchService(MatchService[str]):
    @property
    def id(self) -> str:
        return self._id

    def __init__(
        self, id: str, words_file: str, index_endpoint_name: str, deployed_index_id: str
    ) -> None:
        self._id = id
        with open(words_file, "r") as f:
            words = f.readlines()
            self.words = [(word.strip(), word.strip()) for word in words]

        self.nlp = spacy.load("en_core_web_md")

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

    def get_all(self) -> List[Tuple[str, str]]:
        """Get all existing ids and items."""
        return self.words

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return id

    def convert_to_embeddings(self, target: str) -> List[float]:
        return self.nlp.vocab["target"].vector.tolist()

    def match(
        self, target: str, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        embeddings = self.convert_to_embeddings(target=target)

        response = self.index_endpoint.match(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings],
            num_neighbors=num_neighbors,
        )

        matches_all = [match for matches in response for match in matches]

        return sorted(matches_all, key=lambda x: x.distance, reverse=True)
