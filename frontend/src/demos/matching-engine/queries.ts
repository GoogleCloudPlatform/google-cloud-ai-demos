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

export interface ItemInfo {
  id: string;
  img: string;
  title: string;
}

export interface ItemInfosResponse {
  items: ItemInfo[];
}

export async function getImages(): Promise<ItemInfosResponse> {
  return client.get('/images').then((response) => response.data);
}

export interface MatchResult {
  image: string;
  distance: number;
}

export interface MatchResponse {
  totalImageCount: number;
  results: MatchResult[];
}

export async function fetchMatchs(imageId: string): Promise<MatchResponse> {
  return client
    .post('/fetch-recommendations', {
      imageId: imageId,
    })
    .then((response) => response.data);
}
