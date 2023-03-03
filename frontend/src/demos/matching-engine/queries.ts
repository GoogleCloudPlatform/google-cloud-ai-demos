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

const client = axios.create({ baseURL: process.env.REACT_APP_API_SERVER_MATCHING_ENGINE });

export interface ItemInfo {
  id: string;
  img: string;
  text: string;
}

export interface ItemInfosResponse {
  items: ItemInfo[];
}

export async function getWords(): Promise<ItemInfosResponse> {
  return client.get('items/words').then((response) => response.data);
}

export async function getImages(): Promise<ItemInfosResponse> {
  return client.get('items/images').then((response) => response.data);
}

export interface MatchResult {
  text: string;
  image?: string;
  distance: number;
}

export interface MatchResponse {
  totalIndexCount: number;
  results: MatchResult[];
}

export async function matchWord(id: string): Promise<MatchResponse> {
  return client
    .post('/match/words', {
      id: id,
    })
    .then((response) => response.data);
}

export async function matchImage(id: string): Promise<MatchResponse> {
  return client
    .post('/text/image', {
      id: id,
    })
    .then((response) => response.data);
}