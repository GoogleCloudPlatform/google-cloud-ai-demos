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

import dataclasses
import logging
from typing import Any, Dict, List, Optional, Tuple

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel

import register_services
import tracer_helper
from services import search_service

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)

app = FastAPI()


search_service_registry: Dict[
    str, search_service.SearchService
] = register_services.register_services()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


class GetItemsResponse(BaseModel):
    items: List[search_service.Item]


@tracer.start_as_current_span(f"/match-registry")
@app.get("/match-registry")
async def get_search_registry():
    return [
        {
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "allowsTextInput": service.allows_text_input,
            "code": service.code_info,
        }
        for service in search_service_registry.values()
    ]


@app.get("/items/{search_service_id}")
async def get_suggestions(search_service_id: str):
    with tracer.start_as_current_span(f"/items/{search_service_id}"):
        service = search_service_registry.get(search_service_id)
        if service:
            return GetItemsResponse(items=service.get_suggestions())
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Match service not found for id: {search_service_id}",
            )


class SearchByTextRequest(BaseModel):
    text: str
    numNeighbors: int = 10


@dataclasses.dataclass
class MatchResponse:
    totalIndexCount: int
    results: List[search_service.SearchResult]


@app.post("/match-by-text/{search_service_id}")
async def match_by_text(
    search_service_id: str, request: SearchByTextRequest
) -> MatchResponse:
    with tracer.start_as_current_span(f"/match-by-text/{search_service_id}"):
        service = search_service_registry.get(search_service_id)

        if not service:
            raise HTTPException(
                status_code=400,
                detail=f"Match service not found for id: {search_service_id}",
            )

        try:
            results = service.search(
                query=request.text, num_neighbors=request.numNeighbors
            )

            return MatchResponse(
                totalIndexCount=service.get_total_index_count(), results=results
            )
        except Exception as ex:
            logger.error(ex)
            raise HTTPException(
                status_code=500, detail=f"There was an error getting matches"
            )
