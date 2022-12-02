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

logger = logging.getLogger(__name__)
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.get("/images")
async def images():
    return [dataset.as_response() for dataset in dataset_service.get_datasets()]


class FetchImageRecommendationRequest(BaseModel):
    imageId: str

@app.post("/fetch-image-recommendations")
def fetchImageRecommendations(
    request: FetchImageRecommendationRequest,
):
    # Get image
    image = dataset_service.get_image(image_id=request.imageId)

    if image is None:
        raise HTTPException(
            status_code=404, detail=f"Image not found: {request.datasetId}"
        )

    results = match_service.match(image=image)

    return results