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

const client = axios.create({ baseURL: import.meta.env.VITE_API_SERVER_UNIFIED_CLOUD_SEARCH });
export interface SuggestionInfo {
  id?: string;
  img?: string;
  text?: string;
}

export interface SuggestionInfosResponse {
  items: SuggestionInfo[];
}

export async function getSuggestions(service_id: string): Promise<SuggestionInfosResponse> {
  return client.get(`suggestions/${service_id}`).then((response) => response.data);
}

export interface SearchServiceInfo {
  id: string;
  name: string;
  description: string;
  code?: { url: string; title: string };
}

export async function getSearchServiceInfo(): Promise<SearchServiceInfo[]> {
  return client.get(`search-registry`).then((response) => response.data);
}

export interface SearchResult {
  title: string;
  description: string;
  image?: string;
  url?: string;
  distance: number;
}

export interface MatchResponse {
  totalIndexCount: number;
  results: SearchResult[];
}

export async function matchByText(serviceId: string, text: string): Promise<MatchResponse> {
  return client
    .post(`/search-by-text/${serviceId}`, {
      text: text,
      numNeighbors: 20,
    })
    .then((response) => response.data);
}
