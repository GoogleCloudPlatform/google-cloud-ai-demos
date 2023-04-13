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
import os
import traceback
from typing import Dict, List

import tracer_helper
from services import (  # sentence_transformer_service,; spacy_match_service,; text_to_image_match_service,
    coca_text_to_image_match_service,
    match_service,
    palm_text_match_service,
)

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


@tracer.start_as_current_span("register_services")
def register_services() -> Dict[str, match_service.MatchService]:
    services: List[match_service.MatchService] = []

    # try:
    #     with tracer.start_as_current_span("text_match_service_instance init"):
    #         text_match_service_instance = spacy_match_service.SpacyTextMatchService(
    #             id="words",
    #             name="English words",
    #             description="Common English words encoded using spaCy embeddings",
    #             words_file="data/popular-english-words.txt",
    #             index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/1907670266377404416",
    #             deployed_index_id="spacy_common_words",
    #             code_info=match_service.CodeInfo(
    #                 url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb",
    #                 title="Create Vertex AI Matching Engine index",
    #             ),
    #         )

    #         services.append(text_match_service_instance)
    # except Exception as ex:
    #     traceback.print_exc()
    #     logging.error(ex)

    # try:
    #     with tracer.start_as_current_span(
    #         "stackoverflow_questions_match_service_instance init"
    #     ):
    #         stackoverflow_questions_match_service_instance = sentence_transformer_service.SentenceTransformerMatchService(
    #             id="stackoverflow_questions",
    #             name="StackOverflow",
    #             description="Python-tagged questions from StackOverflow encoded using sentence-t5.",
    #             words_file="data/stackoverflow_questions.txt",
    #             sentence_transformer_id_or_path="sentence-t5-base",
    #             index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/6289813441297252352",
    #             deployed_index_id="tmp9w803to2",
    #             redis_host="10.43.4.3",
    #             redis_port="6379",
    #             code_info=match_service.CodeInfo(
    #                 url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_stack_overflow_embeddings.ipynb",
    #                 title="Using Vertex AI Matching Engine for StackOverflow Questions",
    #             ),
    #         )

    #         services.append(stackoverflow_questions_match_service_instance)
    # except Exception as ex:
    #     traceback.print_exc()
    #     logging.error(ex)

    # try:
    #     with tracer.start_as_current_span("text_to_image_match_service_instance init"):
    #         text_to_image_match_service_instance = text_to_image_match_service.TextToImageMatchService(
    #             id="text_to_image",
    #             name="Text to image",
    #             description="DiffusionDB images encoded using CLIP.",
    #             prompts_file="data/text_to_image.txt",
    #             model_id_or_path="clip-vit-base-patch32",
    #             index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/3889676314885488640",
    #             deployed_index_id="tmpy8lywd0h_filtered",
    #             image_directory_uri="https://storage.googleapis.com/ai-demos/text_to_image",
    #             code_info=match_service.CodeInfo(
    #                 url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_text_to_image_embeddings.ipynb",
    #                 title="Using Vertex AI Matching Engine for Text-to-Image Embeddings",
    #             ),
    #         )

    #         services.append(text_to_image_match_service_instance)
    # except Exception as ex:
    #     traceback.print_exc()
    #     logging.error(ex)

    try:
        with tracer.start_as_current_span("palm_text_match_service_instance init"):
            palm_text_match_service_instance = palm_text_match_service.PalmTextMatchService(
                id="stackoverflow_questions_palm",
                name="StackOverflow (PaLM)",
                description="Python-tagged questions from StackOverflow encoded using PaLM.",
                words_file="data/stackoverflow_questions.txt",
                index_endpoint_name="projects/471602922801/locations/us-central1/indexEndpoints/6886593168481976320",
                deployed_index_id="stack_overflow_07c9",
                redis_host="10.20.4.3",
                redis_port=6379,
            )

            services.append(palm_text_match_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    API_KEY = os.environ.get("GCP_API_KEY")
    logger.error("GCP_API_KEY not set")

    if API_KEY is not None:
        try:
            with tracer.start_as_current_span(
                "coca_text_to_image_match_service_instance init"
            ):
                coca_text_to_image_match_service_instance = coca_text_to_image_match_service.CocaTextToImageMatchService(
                    id="text_to_image_coca",
                    name="Text to image",
                    description="Mercari product images encoded using CoCa.",
                    prompts_file="data/mercari_products.txt",
                    index_endpoint_name="projects/471602922801/locations/us-central1/indexEndpoints/135415852076892160",
                    deployed_index_id="deployed_index_ecbd",
                    image_directory_uri="https://storage.googleapis.com/vertex-ai-samples/coca_text_to_image",
                    api_key=API_KEY,
                    redis_host="10.20.4.11",
                    redis_port=6379,
                    code_info=None,
                    # code_info=match_service.CodeInfo(
                    #     url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_text_to_image_embeddings.ipynb",
                    #     title="Using Vertex AI Matching Engine for Text-to-Image Embeddings",
                    # ),
                )

                services.append(coca_text_to_image_match_service_instance)
        except Exception as ex:
            traceback.print_exc()
            logging.error(ex)

    return {service.id: service for service in services}
