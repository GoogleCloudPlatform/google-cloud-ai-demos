import logging
import random
from typing import List, Optional

import numpy as np
import redis
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint
from opentelemetry import trace
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from sentence_transformers import SentenceTransformer

from services.match_service import Item, MatchResult, VertexAIMatchingEngineMatchService

tracer_provider = TracerProvider()
cloud_trace_exporter = CloudTraceSpanExporter()
tracer_provider.add_span_processor(BatchSpanProcessor(cloud_trace_exporter))
trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer(__name__)

logger = logging.getLogger(__name__)


class SentenceTransformerMatchService(VertexAIMatchingEngineMatchService[str]):
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
        sentence_transformer_id_or_path: str,
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

        self.encoder = SentenceTransformer(sentence_transformer_id_or_path)

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port)

    @tracer.start_as_current_span("get_all")
    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=None, text=word, image=None) for word in self.questions],
            min(num_items, len(self.questions)),
        )

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return self.redis_client.get(str(id))

    @tracer.start_as_current_span("get_by_ids")
    def get_by_ids(self, ids: List[str]) -> List[Optional[str]]:
        """Get an item by id."""
        return [self.redis_client.get(str(id)) for id in ids]

    @tracer.start_as_current_span("convert_to_embeddings")
    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        vector = self.encoder.encode(target)

        if np.any(vector):
            return vector.tolist()
        else:
            return None

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = self.get_by_ids(ids=[match.id for match in matches])

        return [
            MatchResult(
                text=item,
                # There is a bug in matching engine where the negative of DOT_PRODUCT_DISTANCE is returned, instead of the distance itself.
                distance=max(0, 1 - match.distance),
                url=f"https://stackoverflow.com/questions/{match.id}",
            )
            for item, match in zip(items, matches)
        ]
