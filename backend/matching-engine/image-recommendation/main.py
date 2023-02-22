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
import dataclasses
import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from services import match_service

logger = logging.getLogger(__name__)
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

app = FastAPI()

match_service_registry: Dict[str, match_service.MatchService] = {}


try:
    text_match_service_instance = match_service.TextMatchService(
        id="words",
        words_file="data/google-10000-english-no-swears.txt",
        index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/7775016155911028736",
        deployed_index_id="tree_ah_glove_deployed_unique",
    )

    match_service_registry[text_match_service_instance.id] = text_match_service_instance
except Exception as ex:
    print(ex)
    logging.error(ex)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/ping")
async def ping():
    return "pong"


class GetItemsResponse(BaseModel):
    items: List[match_service.Item]


@app.get("/items/{match_service_id}")
async def get_items(match_service_id: str):
    service = match_service_registry.get(match_service_id)
    if service:
        return GetItemsResponse(items=service.get_all())
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Match service not found for id: {match_service_id}",
        )


class MatchRequest(BaseModel):
    id: str
    numNeighbors: int = 10


@dataclasses.dataclass
class MatchResponse:
    totalIndexCount: int
    results: List[match_service.MatchResult]


@app.post("/match/{match_service_id}")
async def match(match_service_id: str, request: MatchRequest) -> MatchResponse:
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
            status_code=404, detail=f"Item not found for id: {request.id}"
        )

    return MatchResponse(
        totalIndexCount=service.get_total_index_count(), results=results
    )
