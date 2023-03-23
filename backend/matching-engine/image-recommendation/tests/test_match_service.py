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
from services import (match_service, sentence_transformer_service,
                      spacy_match_service)

logger = logging.getLogger(__name__)
from typing import Dict, List

service_registry = register_services.register_services()


def test_spacy_convert_to_embeddings():
    service = service_registry["words"]
    items = service.get_all()

    assert len(items) > 0, "No items found"

    embeddings = service.convert_to_embeddings(target="sandwich")

    assert embeddings is not None, "No embeddings found"
    assert isinstance(embeddings[0], float), "Embedding value is not a float"
    assert np.any(embeddings), "Empty embeddings found"


def test_tf_hub_convert_to_embeddings():
    service = service_registry["stackoverflow_questions"]
    items = service.get_all()

    assert len(items) > 0, "No items found"

    embeddings = service.convert_to_embeddings(target="Hello world")

    assert embeddings is not None, "No embeddings found"
    assert isinstance(embeddings[0], float), "Embedding value is not a float"
    assert np.any(embeddings), "Empty embeddings found"


def test_text_to_image_convert_to_embeddings():
    service = service_registry["text_to_image"]
    items = service.get_all()

    assert len(items) > 0, "No items found"

    embeddings = service.convert_to_embeddings(target="Hello world")

    assert embeddings is not None, "No embeddings found"
    assert isinstance(embeddings[0], float), "Embedding value is not a float"
    assert np.any(embeddings), "Empty embeddings found"
