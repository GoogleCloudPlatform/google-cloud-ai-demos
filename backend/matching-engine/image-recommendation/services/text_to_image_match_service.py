import random
from typing import List, Optional

import numpy as np
from google.cloud.aiplatform.matching_engine import (
    matching_engine_index_endpoint,
)

from transformers import CLIPTokenizerFast, CLIPModel
import torch
from services.match_service import Item, MatchResult, VertexAIMatchingEngineMatchService


class TextToImageMatchService(VertexAIMatchingEngineMatchService[str]):
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
        prompts_file: str,
        model_id: str,
        index_endpoint_name: str,
        deployed_index_id: str,
        image_directory_uri: str,
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self.image_directory_uri = image_directory_uri

        with open(prompts_file, "r") as f:
            prompts = f.readlines()
            self.prompts = [prompt.strip() for prompt in prompts]

        self.index_endpoint = (
            matching_engine_index_endpoint.MatchingEngineIndexEndpoint(
                index_endpoint_name=index_endpoint_name
            )
        )
        self.deployed_index_id = deployed_index_id

        # if you have CUDA or MPS, set it to the active device like this
        device = (
            "cuda"
            if torch.cuda.is_available()
            else ("mps" if torch.backends.mps.is_available() else "cpu")
        )

        # we initialize a tokenizer, image processor, and the model itself
        self.tokenizer = CLIPTokenizerFast.from_pretrained(model_id)
        # self.processor = CLIPProcessor.from_pretrained(model_id)
        self.model = CLIPModel.from_pretrained(model_id).to(device)

    def get_all(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.prompts],
            min(num_items, len(self.prompts)),
        )

    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return f"{self.image_directory_uri}/{id}"

    def convert_to_embeddings(self, target: str) -> Optional[List[float]]:
        # create transformer-readable tokens
        inputs = self.tokenizer(target, return_tensors="pt")

        # use CLIP to encode tokens into a meaningful embedding
        text_emb = self.model.get_text_features(**inputs)
        text_emb = text_emb.cpu().detach().numpy()

        if np.any(text_emb):
            return text_emb[0].tolist()
        else:
            return None

    def convert_match_neighbors_to_result(
        self, matches: List[matching_engine_index_endpoint.MatchNeighbor]
    ) -> List[Optional[MatchResult]]:
        items = [self.get_by_id(match.id) for match in matches]
        return [
            MatchResult(text=None, distance=match.distance, image=item)
            if item is not None
            else None
            for item, match in zip(items, matches)
        ]