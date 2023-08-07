/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import { ReactComponent as ArchitectureImage } from 'demos/matching-engine/static/architecture.svg';
import GitHubButton from 'react-github-btn';

export default () => (
  <div className="container mx-auto">
    <div className="grid grid-cols-12 gap-7">
      <div className="col-span-12 lg:col-span-6">
        <article className="prose">
          <h6 className="text-lg font-semibold">Architecture</h6>
          <p className="text-base">The demo consists of a React frontend served via nginx and hosted on Cloud Run.</p>
          <span className="uppercase text-xs">Frontend</span>
          <p className="text-sm">
            The frontend is built using React and TailwindCSS. It is served using NGINX. This is then containerized and
            served on{' '}
            <a
              href="https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Cloud Run
            </a>
          </p>
          <span className="uppercase text-xs">Backend</span>
          <p className="text-sm">
            The backend is a Python app served using FastAPI. It uses a threadpool to handle multiple training requests
            in parallel. This is then containerized and deployed on Cloud Run.
          </p>
          <span className="uppercase text-xs">Embeddings</span>
          <p className="text-sm">
            The demo uses Vertex AI{' '}
            <a
              href="https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-embeddings"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Embeddings API for Text
            </a>{' '}
            for generating embeddings for the Stack Overflow questions, and{' '}
            <a
              href="https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-multimodal-embeddings"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Multimodal Embeddings
            </a>{' '}
            for item images and text queries.
          </p>
          <span className="uppercase text-xs">Similarity Search</span>
          <p className="text-sm">
            The demo uses{' '}
            <a
              href="https://cloud.google.com/vertex-ai/docs/matching-engine/overview"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Matching Engine
            </a>{' '}
            to do vector similarity search at scale.
          </p>
          <span className="uppercase text-xs">Memorystore</span>
          <p className="text-sm">
            <a
              href="https://cloud.google.com/memorystore/docs/redis/redis-overview"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Memorystore
            </a>{' '}
            is a low-latency key-value database used to hydrate data that is retrieved from Matching Engine. For
            example, given a StackOverflow question id, Memorystore is used to retrieve the question title.
          </p>
          <span className="uppercase text-xs">Cloud Vision</span>
          <p className="text-sm">
            <a
              href="https://cloud.google.com/vision"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Cloud Vision
            </a>{' '}
            is used to filter out explicit images for the text-to-image dataset.
          </p>
          <h6 className="text-lg font-semibold">Deploy</h6>
          <p className="text-base">See the Github repo for deployment instructions</p>
          <GitHubButton
            href="https://github.com/googlecloudplatform/google-cloud-ai-demos"
            data-size="large"
            data-show-count="true"
            aria-label="Star googlecloudplatform/google-cloud-ai-demos on GitHub"
          >
            Star
          </GitHubButton>
        </article>
      </div>
      <div className="col-span-12 lg:col-span-6">
        <div className="flex">
          <ArchitectureImage
          // onClick={() => window.open('demos/matching-engine/static/architecture.svg', '_blank')}
          // className="h-96"
          />
        </div>
      </div>
    </div>
  </div>
);
