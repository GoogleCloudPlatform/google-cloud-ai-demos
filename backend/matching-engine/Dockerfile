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

# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM tiangolo/uvicorn-gunicorn:python3.9

WORKDIR /app

COPY requirements.txt .
COPY main.py .
COPY models.py .
COPY register_services.py .
COPY tracer_helper .
COPY data data
COPY services services
COPY tests tests

# Install dependencies.
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN python -m spacy download en_core_web_md

# Download git lfs
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN apt install git-lfs
RUN git lfs install

# Download clip-vit-base-patch32
RUN git clone --depth=1 https://huggingface.co/openai/clip-vit-base-patch32
# Remove large, unused files
RUN rm clip-vit-base-patch32/flax_model.msgpack
RUN rm clip-vit-base-patch32/tf_model.h5
RUN rm -rf clip-vit-base-patch32/.git

# Download sentence-transformers/sentence-t5-base
RUN git clone --depth=1 https://huggingface.co/sentence-transformers/sentence-t5-base
# Remove large, unused files
RUN rm sentence-t5-base/rust_model.ot
RUN rm -rf sentence-t5-base/.git

RUN python -m pytest tests/test_match_service.py
