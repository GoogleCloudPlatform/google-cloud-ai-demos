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

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

import register_services
from services import match_service

import tracer_helper
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)

app = FastAPI()


match_service_registry: Dict[
    str, match_service.MatchService
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
    items: List[match_service.Item]


@tracer.start_as_current_span(f"/match-registry")
@app.get("/match-registry")
async def get_match_registry():
    return [
        {
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "allowsTextInput": service.allows_text_input,
            "code": service.code_info
        }
        for service in match_service_registry.values()
    ]


@app.get("/items/{match_service_id}")
async def get_items(match_service_id: str):
    with tracer.start_as_current_span(f"/items/{match_service_id}"):
        service = match_service_registry.get(match_service_id)
        if service:
            return GetItemsResponse(items=service.get_all())
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Match service not found for id: {match_service_id}",
            )


class MatchByIdRequest(BaseModel):
    id: str
    numNeighbors: int = 10


class MatchByTextRequest(BaseModel):
    text: str
    numNeighbors: int = 10


@dataclasses.dataclass
class MatchResponse:
    totalIndexCount: int
    results: List[match_service.MatchResult]


@app.post("/match-by-id/{match_service_id}")
async def match_by_id(
    match_service_id: str, request: MatchByIdRequest
) -> MatchResponse:
    with tracer.start_as_current_span(f"/match-by-id/{match_service_id}"):
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
            except Exception as ex:
                logger.error(ex)
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


@app.post("/match-by-text/{match_service_id}")
async def match_by_text(
    match_service_id: str, request: MatchByTextRequest
) -> MatchResponse:
    with tracer.start_as_current_span(f"/match-by-text/{match_service_id}"):
        service = match_service_registry.get(match_service_id)

        if not service:
            raise HTTPException(
                status_code=400,
                detail=f"Match service not found for id: {match_service_id}",
            )

        try:
            results = service.match(
                target=request.text, num_neighbors=request.numNeighbors
            )

            return MatchResponse(
                totalIndexCount=service.get_total_index_count(), results=results
            )
        except Exception as ex:
            logger.error(ex)
            raise HTTPException(
                status_code=500, detail=f"There was an error getting matches"
            )
