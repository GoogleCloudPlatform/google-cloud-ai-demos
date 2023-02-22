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
from services import match_service

logger = logging.getLogger(__name__)
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

app = FastAPI()

text_match_service_instance = match_service.TextMatchService(
    words_file="words.txt",
    index_endpoint_name="projects/1012616486416/locations/us-central1/indexEndpoints/3521155201627062272",
    deployed_index_id="tree_ah_glove_deployed_unique_3",
)

match_service_registry: Dict[str, match_service.MatchService] = {
    text_match_service_instance.id: text_match_service_instance
}

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/items/{match_service_id}")
async def get_items(match_service_id: str):
    service = match_service_registry.get(match_service_id)
    if service:
        return service.get_all()
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Match service not found for id: {match_service_id}",
        )


class MatchRequest(BaseModel):
    id: str
    numNeighbors: int = 10


@app.post("match/{match_service_id}")
def match(
    match_service_id: str,
    request: MatchRequest,
):
    service = match_service_registry.get(match_service_id)

    if not service:
        raise HTTPException(
            status_code=400,
            detail=f"Match service not found for id: {match_service_id}",
        )

    item = service.get_by_id(id=request.id)

    if item is not None:
        try:
            results = service.match(target=item, num_neighbors=request.numNeighbors)
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
