import logging
import random
from typing import List, Optional

import numpy as np
import redis
import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text  # Registers the ops.
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint

from services.match_service import Item, MatchResult, VertexAIMatchingEngineMatchService

logger = logging.getLogger(__name__)


class TFHubMatchService(VertexAIMatchingEngineMatchService[str]):
    reverse_scores: bool = True

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

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        words_file: str,
        tf_hub_url: str,
        index_endpoint_name: str,
        deployed_index_id: str,
        redis_host: str,  # Redis host to get data about a match id
        redis_port: str,  # Redis port to get data about a match id
    ) -> None:
        self._id = id
        self._name = name
        self._description = description

        with open(words_file, "r") as f:
            questions = f.readlines()
            self.questions = [question.strip() for question in questions]

        self.encoder = hub.KerasLayer(tf_hub_url)

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port)

    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=None, text=word, image=None) for word in self.questions],
            min(num_items, len(self.questions)),
        )

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return self.redis_client.get(str(id))

    def get_by_ids(self, ids: List[str]) -> List[Optional[str]]:
        """Get an item by id."""
        return [self.redis_client.get(str(id)) for id in ids]

    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = self.encoder(tf.constant([target]))[0]

        if np.any(vector):
            return vector.numpy()[0].tolist()
        else:
            return None

    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = self.get_by_ids(ids=[match.id for match in matches])

        return [
            MatchResult(
                text=item,
                distance=1 - match.distance,
                url=f"https://stackoverflow.com/questions/{match.id}",
            )
            for item, match in zip(items, matches)
        ]
