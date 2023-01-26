import abc
from typing import Any, Generic, List, TypeVar
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index_endpoint,
)
import models
import numpy as np

import spacy

T = TypeVar("T")


class MatchService(abc.ABC, Generic[T]):
    @abc.abstractmethod
    def convert_to_embeddings(self, target: T) -> np.ndarray:
        pass

    @abc.abstractmethod
    def match(
        self, target: T, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        pass


class ImageMatchService(MatchService[models.Image]):
    def __init__(
        self, index_endpoint_name: str, deployed_index_id: str, name: str
    ) -> None:
        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

    def convert_to_embeddings(self, target: models.Image) -> np.ndarray:
        return np.array([])  # TODO

    def match(
        self, target: models.Image, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        embeddings = self.convert_to_embeddings(target=target)

        response = self.index_endpoint.match(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings.tolist()],
            num_neighbors=num_neighbors,
        )

        matches_all = [match for matches in response for match in matches]

        return sorted(matches_all, key=lambda x: x.distance, reverse=True)


class TextMatchService(MatchService[str]):
    def __init__(
        self, index_endpoint_name: str, deployed_index_id: str, name: str
    ) -> None:
        self.nlp = spacy.load("en_core_web_md")

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

    def convert_to_embeddings(self, target: str) -> np.ndarray:
        return self.nlp.vocab["target"].vector.tolist()

    def match(
        self, target: str, num_neighbors: int
    ) -> List[matching_engine_index_endpoint.MatchNeighbor]:
        embeddings = self.convert_to_embeddings(target=target)

        response = self.index_endpoint.match(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings.tolist()],
            num_neighbors=num_neighbors,
        )

        matches_all = [match for matches in response for match in matches]

        return sorted(matches_all, key=lambda x: x.distance, reverse=True)
