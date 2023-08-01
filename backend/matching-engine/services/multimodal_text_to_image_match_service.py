# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import random
from typing import Dict, List, Optional, TypeVar

import google.auth
import google.auth.transport.requests
import redis
import requests
from google.cloud.aiplatform.matching_engine import matching_engine_index_endpoint
from services.multimodal_embedding_client import MultimodalEmbeddingPredictionClient

import storage_helper
import tracer_helper
from services.match_service import (
    CodeInfo,
    Item,
    MatchResult,
    VertexAIMatchingEngineMatchService,
)

tracer = tracer_helper.get_tracer(__name__)

DESTINATION_BLOB_NAME = "multimodal_text_to_image"


def get_access_token() -> str:
    # Get default access token
    creds, _ = google.auth.default()
    # creds.valid is False, and creds.token is None
    # Need to refresh credentials to populate those
    auth_req = google.auth.transport.requests.Request()
    creds.refresh(auth_req)
    access_token = creds.token

    if access_token is None or len(access_token) == 0:
        raise RuntimeError("No access token found")

    return access_token


T = TypeVar("T")


class MultimodalTextToImageMatchService(VertexAIMatchingEngineMatchService[T]):
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
        return self._allows_text_input

    @property
    def allows_image_input(self) -> bool:
        """If true, this service allows image input."""
        return self._allows_image_input

    @property
    def code_info(self) -> Optional[CodeInfo]:
        """Info about code used to generate index."""
        return self._code_info

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        allows_text_input: bool,
        allows_image_input: bool,
        index_endpoint_name: str,
        deployed_index_id: str,
        project_id: str,
        gcs_bucket: str,
        is_public_index_endpoint: bool,
        prompts_texts_file: Optional[str] = None,
        prompt_images_file: Optional[str] = None,
        code_info: Optional[CodeInfo] = None,
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self._code_info = code_info
        self.project_id = project_id
        self._allows_text_input = allows_text_input
        self._allows_image_input = allows_image_input
        self.gcs_bucket = gcs_bucket

        if prompts_texts_file:
            with open(prompts_texts_file, "r") as f:
                prompts = f.readlines()
                self.prompt_texts = [prompt.strip() for prompt in prompts]
        else:
            self.prompt_texts = []

        if prompt_images_file:
            with open(prompt_images_file, "r") as f:
                prompt_images = f.readlines()
                self.prompt_images = [prompt.strip() for prompt in prompt_images]
        else:
            self.prompt_images = []

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id
        self.client = MultimodalEmbeddingPredictionClient(project_id=self.project_id)
        self.is_public_index_endpoint = is_public_index_endpoint

    @tracer.start_as_current_span("get_suggestions")
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get suggestions for search queries."""
        text_prompts = (
            [Item(id=word, text=word, image=None) for word in self.prompt_texts]
            if self.allows_text_input
            else []
        )
        image_prompts = (
            [
                Item(id=image_url, text="", image=image_url)
                for image_url in self.prompt_images
            ]
            if self.allows_image_input
            else []
        )

        prompts = text_prompts + image_prompts

        return random.sample(
            prompts,
            min(num_items, len(prompts)),
        )

    def encode_image_to_embeddings(self, image_uri: str) -> List[float]:
        try:
            return self.client.get_embedding(
                text=None, image_file=image_uri
            ).image_embedding
        except Exception as ex:
            raise RuntimeError("Error getting embedding.")

    def encode_text_to_embeddings(self, text: str) -> List[float]:
        try:
            return self.client.get_embedding(text=text, image_file=None).text_embedding
        except Exception as ex:
            raise RuntimeError("Error getting embedding.")

    @tracer.start_as_current_span("convert_text_to_embeddings")
    def convert_text_to_embeddings(self, target: str) -> Optional[List[float]]:
        return self.encode_text_to_embeddings(text=target)

    @tracer.start_as_current_span("convert_image_to_embeddings")
    def convert_image_to_embeddings(
        self, image_file_local_path: str
    ) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        # Upload image file
        image_uri = storage_helper.upload_blob(
            source_file_name=image_file_local_path,
            bucket_name=self.gcs_bucket,
            destination_blob_name=DESTINATION_BLOB_NAME,
        )

        return self.encode_image_to_embeddings(image_uri=image_uri)

    @tracer.start_as_current_span("convert_image_to_embeddings_remote")
    def convert_image_to_embeddings_remote(
        self, image_file_remote_path: str
    ) -> Optional[List[float]]:
        """Convert a given item to an embedding representation."""
        return self.encode_image_to_embeddings(
            image_uri=image_file_remote_path,
        )


class MercariTextToImageMatchService(MultimodalTextToImageMatchService[Dict[str, str]]):
    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        allows_text_input: bool,
        allows_image_input: bool,
        index_endpoint_name: str,
        deployed_index_id: str,
        project_id: str,
        redis_host: str,  # Redis host to get data about a match id
        redis_port: int,  # Redis port to get data about a match id
        gcs_bucket: str,
        is_public_index_endpoint: bool,
        prompts_texts_file: Optional[str] = None,
        prompt_images_file: Optional[str] = None,
        code_info: Optional[CodeInfo] = None,
    ) -> None:
        super().__init__(
            id=id,
            name=name,
            description=description,
            code_info=code_info,
            project_id=project_id,
            allows_text_input=allows_text_input,
            allows_image_input=allows_image_input,
            gcs_bucket=gcs_bucket,
            prompts_texts_file=prompts_texts_file,
            prompt_images_file=prompt_images_file,
            index_endpoint_name=index_endpoint_name,
            deployed_index_id=deployed_index_id,
            is_public_index_endpoint=is_public_index_endpoint,
        )
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port)

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[Dict[str, str]]:
        """Get an item by id."""
        retrieved = self.redis_client.hgetall(str(id))

        if retrieved is not None:
            # Convert the byte strings to regular strings
            return {key.decode(): value.decode() for key, value in retrieved.items()}
        else:
            return None

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]
        return [
            MatchResult(
                title=item["name"],
                description=item["description"],
                distance=max(0, 1 - match.distance),
                url=item["url"],
                image=item["img_url"],
            )
            if item is not None
            else None
            for item, match in zip(items, matches)
        ]


class RoomsTextToImageMatchService(MultimodalTextToImageMatchService[str]):
    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""

        return id

    @tracer.start_as_current_span("convert_match_neighbors_to_result")
    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]
        return [
            MatchResult(
                title=None,
                description=None,
                distance=max(0, 1 - match.distance),
                url=None,
                image=f"https://storage.googleapis.com/ai-demos-us-central1/interior_images/mit_indoor/{item}",
            )
            if item is not None
            else None
            for item, match in zip(items, matches)
        ]
