# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from services import dataset_service, match_service

logger = logging.getLogger(__name__)
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

app = FastAPI()
text_dataset_service_instance = dataset_service.TextDatasetService(
    words_file="words.txt"
)

# image_match_service_instance = match_service.ImageMatchService(
#     index_endpoint_name="projects/1012616486416/locations/us-central1/indexEndpoints/3118505247442468864",
#     deployed_index_id="tree_ah_glove_deployed_unique_3",
# )
text_match_service_instance = match_service.TextMatchService(
    index_endpoint_name="projects/1012616486416/locations/us-central1/indexEndpoints/3521155201627062272",
    deployed_index_id="tree_ah_glove_deployed_unique_3",
)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/text/items")
async def words():
    return text_dataset_service_instance.get_all()


class FetchRecommendationRequest(BaseModel):
    id: str
    numNeighbors: int = 10


@app.post("/text/match")
def text_match(
    request: FetchRecommendationRequest,
):
    text = text_dataset_service_instance.get_by_id(id=request.id)

    if text is not None:
        try:
            results = text_match_service_instance.match(
                target=text, num_neighbors=request.numNeighbors
            )
        except Exception:
            raise HTTPException(
                status_code=500, detail=f"There was an error getting matches"
            )

    else:
        raise HTTPException(
            status_code=404, detail=f"Word not found for id: {request.id}"
        )

    return results


# @app.get("/images")
# async def images():
#     return dataset_service_instance.get_images()


# class FetchImageRecommendationRequest(BaseModel):
#     imageId: str
#     numNeighbors: int = 10


class FetchTextRecommendationRequest(BaseModel):
    text: str
    numNeighbors: int = 10


# @app.post("/fetch-image-recommendations")
# def fetch_image_recommendations(
#     request: FetchImageRecommendationRequest,
# ):
#     # Get image
#     image = text_match_service_instance.get_image_by_id(id=request.imageId)

#     if image is None:
#         raise HTTPException(
#             status_code=404, detail=f"Image not found: {request.imageId}"
#         )

#     results = image_match_service_instance.match(
#         target=image, num_neighbors=request.numNeighbors
#     )

#     return results


# @app.post("/fetch-image-recommendations")
# def fetch_text_recommendations(
#     request: FetchTextRecommendationRequest,
# ):
#     results = text_match_service_instance.match(
#         target=request.text, num_neighbors=request.numNeighbors
#     )

#     return results
