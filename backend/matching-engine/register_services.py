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

import constants
import tracer_helper
from services import (
    multimodal_text_to_image_match_service,
    match_service,
    palm_text_match_service,
)

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


@tracer.start_as_current_span("register_services")
def register_services() -> Dict[str, match_service.MatchService]:
    services: List[match_service.MatchService] = []

    try:
        with tracer.start_as_current_span("palm_text_match_service_instance init"):
            palm_text_match_service_instance = palm_text_match_service.PalmTextMatchService(
                id="stackoverflow_questions_palm",
                name="StackOverflow (Text)",
                description="Questions from StackOverflow encoded using Vertex Text Embeddings.",
                words_file="data/stackoverflow_questions.txt",
                index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/7332062503498678272",
                deployed_index_id="deployed_index_id_unique_public",
                redis_host="10.203.141.107",
                redis_port=6379,
                code_info=match_service.CodeInfo(
                    url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_stack_overflow_embeddings_vertex.ipynb",
                    title="Using Vertex AI Matching Engine and Vertex AI Embeddings for Text",
                ),
            )

            services.append(palm_text_match_service_instance)
    except Exception as ex:
        traceback.print_exc()
        logging.error(ex)

    if constants.GCP_PROJECT_ID is not None and constants.GCS_BUCKET is not None:
        try:
            with tracer.start_as_current_span(
                "multimodal_text_to_image_match_service_instance init"
            ):
                multimodal_text_to_image_match_service_instance = multimodal_text_to_image_match_service.MercariTextToImageMatchService(
                    id="text_to_image_multimodal",
                    name="Mercari text-to-image",
                    description="Mercari product images encoded using Vertex AI Multimodal Embeddings.",
                    prompts_texts_file="data/mercari_products.txt",
                    allows_text_input=True,
                    allows_image_input=False,
                    index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/3663880607005409280",
                    deployed_index_id="deployed_index_1f11",
                    is_public_index_endpoint=True,
                    project_id=constants.GCP_PROJECT_ID,
                    gcs_bucket=constants.GCS_BUCKET,
                    redis_host="10.217.194.235",
                    redis_port=6379,
                    code_info=match_service.CodeInfo(
                        url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_multimodal_embeddings.ipynb",
                        title="Using Vertex AI Multimodal Embeddings and Matching Engine",
                    ),
                )

                services.append(multimodal_text_to_image_match_service_instance)
        except Exception as ex:
            traceback.print_exc()
            logging.error(ex)

        try:
            with tracer.start_as_current_span(
                "multimodal_image_to_image_match_service_instance init"
            ):
                multimodal_image_to_image_match_service_instance = multimodal_text_to_image_match_service.MercariTextToImageMatchService(
                    id="image_to_image_multimodal",
                    name="Mercari image-to-image",
                    description="Mercari product images encoded using Vertex Multimodal Embeddings.",
                    prompt_images_file="data/mercari_product_images.txt",
                    allows_text_input=False,
                    allows_image_input=True,
                    index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/3663880607005409280",
                    deployed_index_id="deployed_index_1f11",
                    is_public_index_endpoint=True,
                    project_id=constants.GCP_PROJECT_ID,
                    gcs_bucket=constants.GCS_BUCKET,
                    redis_host="10.217.194.235",
                    redis_port=6379,
                    code_info=match_service.CodeInfo(
                        url="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_multimodal_embeddings.ipynb",
                        title="Using Vertex AI Multimodal Embeddings and Matching Engine",
                    ),
                )

                services.append(multimodal_image_to_image_match_service_instance)
        except Exception as ex:
            traceback.print_exc()
            logging.error(ex)

    return {service.id: service for service in services}
