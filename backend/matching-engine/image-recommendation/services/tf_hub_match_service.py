import logging
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

logger = logging.getLogger(__name__)


client = bigquery.Client()


class TFHubMatchService(VertexAIMatchingEngineMatchService[str]):
    reverse_scores: bool = True

    @property
    def id(self) -> str:
        return self._id

    @property
    def allows_text_input(self) -> bool:
        """If true, this service allows text input."""
        return True

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
        query = f"""
            SELECT id, title
            FROM `bigquery-public-data.stackoverflow.posts_questions` where id = {id}
        """

        query_job = client.query(query)
        rows = query_job.result()
        df = rows.to_dataframe()

        if len(df) > 0:
            return df.loc[0, "title"]
        else:
            return None

    def get_by_ids(self, ids: List[str]) -> List[Optional[str]]:
        """Get an item by id."""
        # Get question from Bigquery
        ids_string = ",".join(ids)
        query = f"""
            SELECT id, title
            FROM `bigquery-public-data.stackoverflow.posts_questions`
            WHERE id IN ({ids_string})
        """

        query_job = client.query(query)
        rows = query_job.result()
        df = rows.to_dataframe()
        df.id = df.id.astype(str)

        # Create a boolean mask for the names in the DataFrame that match the names in the list
        mask = df["id"].isin(ids)

        # Filter the DataFrame using the mask and preserve the order of the names in the list
        filtered_df = df[mask].set_index("id").reindex(ids)

        return filtered_df.title.fillna(np.nan).replace([np.nan], [None]).tolist()

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
                distance=match.distance,
                url=f"https://stackoverflow.com/questions/{match.id}",
            )
            for item, match in zip(items, matches)
        ]
