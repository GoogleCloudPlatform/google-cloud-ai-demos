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

import axios from 'axios';

const client = axios.create({ baseURL: process.env.REACT_APP_API_SERVER_IMAGE_CLASSIFICATION });

export interface ImageClassificationResponse {
  results: { class: string; score: number };
}

export async function classifyImage(imageId: string): Promise<ImageClassificationResponse> {
  return client
    .post('/classify_image', {
      imageId: imageId,
    })
    .then((response) => response.data);
}
