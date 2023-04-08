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


import dataclasses
import logging
from typing import Any, Dict, Generic, List, Optional, Tuple, TypeVar
from services import unified_cloud_search_service
from services import search_service

import tracer_helper


logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


class MoviesSearchService(unified_cloud_search_service.UnifiedCloudSearchService):
    def convert_to_search_result(
        self, results: List[Dict[str, Any]]
    ) -> List[Optional[search_service.SearchResult]]:
        return [
            search_service.SearchResult(
                title=result["document"]["structData"]["title"],
                description=result["document"]["structData"]["overview"],
                distance=0,
            )
            for result in results
        ]
