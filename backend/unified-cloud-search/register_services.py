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
import traceback
from typing import Dict, List
from services import search_services

import tracer_helper
from services import search_service

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


@tracer.start_as_current_span("register_services")
def register_services() -> Dict[str, search_service.SearchService]:
    services: List[search_service.SearchService] = []

    # try:
    #     with tracer.start_as_current_span("text_search_service_instance init"):
    #         movies_search_service_instance = search_services.MoviesSearchService(
    #             id="movies",
    #             name="Movies",
    #             description="Movie database",
    #             words_file="data/popular-english-words.txt",
    #             project_id="36070612387",
    #             location="global",
    #             datastore_id="movie-test",
    #             code_info=search_service.CodeInfo(
    #                 url="TODO",
    #                 title="Create movie search engine",
    #             ),
    #             is_staging=True,
    #         )

    #         services.append(movies_search_service_instance)
    # except Exception as ex:
    #     traceback.print_exc()
    #     logging.error(ex)

    try:
        with tracer.start_as_current_span("text_search_service_instance init"):
            mercari_search_service_instance = search_services.MercariSearchService(
                id="mercari",
                name="Mercari",
                description="Mercari database",
                words_file="data/popular-english-words.txt",
                project_id="471602922801",
                location="global",
                datastore_id="mercari_1680915352787",
                code_info=search_service.CodeInfo(
                    url="TODO",
                    title="Create retail search engine",
                ),
            )

            services.append(mercari_search_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    return {service.id: service for service in services}
