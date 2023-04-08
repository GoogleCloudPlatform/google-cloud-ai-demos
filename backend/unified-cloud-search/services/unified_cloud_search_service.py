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

import abc
import dataclasses
import functools
import logging
import random
import subprocess
from typing import Any, Dict, List, Optional

import requests

import tracer_helper
from services.search_service import CodeInfo, Item, SearchResult, SearchService

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)

access_token = subprocess.run(
    "gcloud auth print-access-token", shell=True, capture_output=True, text=True
).stdout.strip()


class UnifiedCloudSearchService(SearchService[str]):
    project_id: str
    location: str
    datastore_id: str
    deployed_index_id: str

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
        return False

    @property
    def code_info(self) -> Optional[CodeInfo]:
        """Info about code used to generate index."""
        return self._code_info

    @abc.abstractmethod
    def convert_to_search_result(
        self, results: List[Dict[str, Any]]
    ) -> List[Optional[SearchResult]]:
        pass

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        words_file: str,
        project_id: str,
        location: str,
        datastore_id: str,
        code_info: Optional[CodeInfo],
    ) -> None:
        self._id = id
        self._name = name
        self._description = description
        self._code_info = code_info

        with open(words_file, "r") as f:
            words = f.readlines()
            self.words = [word.strip() for word in words]

        self.project_id = project_id
        self.location = location
        self.datastore_id = datastore_id

    @tracer.start_as_current_span("get_all")
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        return random.sample(
            [Item(id=word, text=word, image=None) for word in self.words],
            min(num_items, len(self.words)),
        )

    @tracer.start_as_current_span("get_by_id")
    def get_by_id(self, id: str) -> Optional[str]:
        """Get an item by id."""
        return id

    @tracer.start_as_current_span("match")
    def search(self, query: str, num_neighbors: int) -> List[SearchResult]:
        logger.info(f"index_endpoint.match completed")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

        json_data = {
            "query": query,
            "page_size": num_neighbors,
            "offset": 0,
        }

        response = requests.post(
            f"https://staging-discoveryengine.sandbox.googleapis.com/v1alpha/projects/{self.project_id}/locations/{self.location}/collections/default_collection/dataStores/{self.datastore_id}/servingConfigs/default_config:search",
            headers=headers,
            json=json_data,
        )

        if response.status_code == 200:
            matches_all = self.convert_to_search_result(
                results=response.json()["results"]
            )

            logger.info(f"matches converted")

            matches_all_nonoptional: List[SearchResult] = [
                match for match in matches_all if match is not None
            ]

            logger.info(f"matches none filtered")

            return matches_all_nonoptional
        else:
            raise RuntimeError("Error retrieving search results")

    @tracer.start_as_current_span("get_total_index_count")
    def get_total_index_count(self) -> int:
        return 1234
