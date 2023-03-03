import random
from typing import List, Optional

import numpy as np
from google.cloud import bigquery
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index_endpoint,
)

import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text  # Registers the ops.
from services.match_service import Item, MatchResult, VertexAIMatchingEngineMatchService


client = bigquery.Client()


class TFHubMatchService(VertexAIMatchingEngineMatchService[str]):
    @property
    def id(self) -> str:
        return self._id

    def __init__(
        self,
        id: str,
        words_file: str,
        tf_hub_url: str,
        index_endpoint_name: str,
        deployed_index_id: str,
    ) -> None:
        self._id = id
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

    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.questions], num_items
        )

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        # Get question from Bigquery
        query = """
            SELECT distinct id, title
            FROM `bigquery-public-data.stackoverflow.posts_questions` where id = 30013009
        """

        query_job = client.query(query)
        rows = query_job.result()
        df = rows.to_dataframe()

        if len(df) > 0:
            return df.loc[0, "title"]
        else:
            return None

    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = self.encoder(tf.constant([target]))[0]

        if np.any(vector):
            return vector.numpy()[0].tolist()
        else:
            return None

    def convert_match_neighbor_to_result(
        self, match: matching_engine_index_endpoint.MatchNeighbor
    ) -> Optional[MatchResult]:
        item = self.get_by_id(match.id)
        if item is not None:
            # Get StackOverflow url
            url = f"https://stackoverflow.com/questions/{match.id}"
            return MatchResult(text=item, distance=match.distance, url=url)
        else:
            return None
