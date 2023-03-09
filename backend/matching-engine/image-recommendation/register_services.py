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

from services import (
    match_service,
    spacy_match_service,
    tf_hub_match_service,
    text_to_image_match_service,
)

logger = logging.getLogger(__name__)
from typing import Dict, List


def register_services() -> Dict[str, match_service.MatchService]:
    services: List[match_service.MatchService] = []

    try:
        text_match_service_instance = spacy_match_service.SpacyTextMatchService(
            id="words",
            name="English words",
            description="Common English words encoded using spaCy embeddings",
            words_file="data/popular-english-words.txt",
            index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/1907670266377404416",
            deployed_index_id="spacy_common_words",
        )

        services.append(text_match_service_instance)
    except Exception as ex:
        print(ex)
        logging.error(ex)

    try:
        stackoverflow_questions_match_service_instance = tf_hub_match_service.TFHubMatchService(
            id="stackoverflow_questions",
            name="StackOverflow",
            description="StackOverflow questions encoded using sentence-t5. See https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_stack_overflow_embeddings.ipynb",
            words_file="data/stackoverflow_questions.txt",
            tf_hub_url="https://tfhub.dev/google/sentence-t5/st5-base/1",
            index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/780081509674516480",
            deployed_index_id="stackoverflow_questions",
        )

        services.append(stackoverflow_questions_match_service_instance)
    except Exception as ex:
        print(ex)
        logging.error(ex)

    try:
        text_to_image_match_service_instance = text_to_image_match_service.TextToImageMatchService(
            id="text_to_image",
            name="Text to image",
            description="DiffusionDB images encoded using CLIP. See https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_create_text_to_image_embeddings.ipynb",
            prompts_file="data/text_to_image.txt",
            model_id="clip-vit-base-patch32",
            index_endpoint_name="projects/782921078983/locations/us-central1/indexEndpoints/5329843033225560064",
            deployed_index_id="image_to_text_diffusiondb_large",
            image_directory_uri="https://storage.googleapis.com/ai-demos/text_to_image",
        )

        services.append(text_to_image_match_service_instance)
    except Exception as ex:
        print(ex)
        logging.error(ex)

    return {service.id: service for service in services}
