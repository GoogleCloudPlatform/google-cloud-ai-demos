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
import tracer_helper

from services import (
    match_service,
    sentence_transformer_service,
    spacy_match_service,
    text_to_image_match_service,
)
from typing import Dict, List

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)



@tracer.start_as_current_span("register_services")
def register_services() -> Dict[str, match_service.MatchService]:
    services: List[match_service.MatchService] = []

    try:
        with tracer.start_as_current_span("text_match_service_instance init"):
            text_match_service_instance = spacy_match_service.SpacyTextMatchService(
                id="words",
                name="English words",
                description="Common English words encoded using spaCy embeddings",
                words_file="data/popular-english-words.txt",
                index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/1907670266377404416",
                deployed_index_id="spacy_common_words",
                code_info=match_service.CodeInfo(url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb", title="Create Vertex AI Matching Engine index")
            )

            services.append(text_match_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    try:
        with tracer.start_as_current_span(
            "stackoverflow_questions_match_service_instance init"
        ):
            stackoverflow_questions_match_service_instance = sentence_transformer_service.SentenceTransformerMatchService(
                id="stackoverflow_questions",
                name="StackOverflow",
                description="Python-tagged questions from StackOverflow encoded using sentence-t5.",
                words_file="data/stackoverflow_questions.txt",
                sentence_transformer_id_or_path="sentence-t5-base",
                index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/6289813441297252352",
                deployed_index_id="tmp9w803to2",
                redis_host="10.43.4.3",
                redis_port="6379",
                code_info=match_service.CodeInfo(url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_stack_overflow_embeddings.ipynb", title="Using Vertex AI Matching Engine for StackOverflow Questions")
            )

            services.append(stackoverflow_questions_match_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    try:
        with tracer.start_as_current_span("text_to_image_match_service_instance init"):
            text_to_image_match_service_instance = text_to_image_match_service.TextToImageMatchService(
                id="text_to_image",
                name="Text to image",
                description="DiffusionDB images encoded using CLIP.",
                prompts_file="data/text_to_image.txt",
                model_id_or_path="clip-vit-base-patch32",
                index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/3889676314885488640",
                deployed_index_id="tmpy8lywd0h_filtered",
                image_directory_uri="https://storage.googleapis.com/ai-demos/text_to_image",
                code_info=match_service.CodeInfo(url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_text_to_image_embeddings.ipynb", title="Using Vertex AI Matching Engine for Text-to-Image Embeddings")
            )

            services.append(text_to_image_match_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    return {service.id: service for service in services}
