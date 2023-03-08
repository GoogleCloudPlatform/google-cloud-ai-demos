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
import numpy as np

import register_services
from services import match_service, spacy_match_service, tf_hub_match_service

logger = logging.getLogger(__name__)
from typing import Dict, List


def test_spacy_convert_to_embeddings():
    service_registry = register_services.register_services()
    embeddings = service_registry["words"].convert_to_embeddings(target="sandwich")

    assert embeddings is not None, "No embeddings found"

    assert np.any(embeddings), "Empty embeddings found"


def test_tf_hub_convert_to_embeddings():
    service_registry = register_services.register_services()
    embeddings = service_registry["stackoverflow_questions"].convert_to_embeddings(
        target="Hello world"
    )

    assert embeddings is not None, "No embeddings found"

    assert np.any(embeddings), "Empty embeddings found"


def test_text_to_image_convert_to_embeddings():
    service_registry = register_services.register_services()
    embeddings = service_registry["text_to_image"].convert_to_embeddings(
        target="Hello world"
    )

    assert embeddings is not None, "No embeddings found"

    assert np.any(embeddings), "Empty embeddings found"
