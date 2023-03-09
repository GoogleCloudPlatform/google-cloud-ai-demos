import random
from typing import List, Optional

import numpy as np
import spacy
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index_endpoint,
)

from services.match_service import Item, MatchResult, VertexAIMatchingEngineMatchService


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

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        words_file: str,
        index_endpoint_name: str,
        deployed_index_id: str,
    ) -> None:
        self._id = id
        self._name = name
        self._description = description

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

    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.words],
            min(num_items, len(self.words)),
        )

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return id

    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = np.array(self.nlp.vocab[target].vector.tolist())

        if np.any(vector):
            return vector.tolist()
        else:
            return None

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
