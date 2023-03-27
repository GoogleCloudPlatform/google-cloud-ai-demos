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
  id?: string;
  img?: string;
  text?: string;
}

export interface ItemInfosResponse {
  items: ItemInfo[];
}

export async function getItems(match_service_id: string): Promise<ItemInfosResponse> {
  return client.get(`items/${match_service_id}`).then((response) => response.data);
}

export interface MatchServiceInfo {
  id: string;
  name: string;
  description: string;
  allowsTextInput: boolean;
  code?: { url: string; title: string };
}

export async function getMatchServiceInfo(): Promise<MatchServiceInfo[]> {
  return client.get(`match-registry`).then((response) => response.data);
}

export interface MatchResult {
  text: string;
  image?: string;
  url?: string;
  distance: number;
}

export interface MatchResponse {
  totalIndexCount: number;
  results: MatchResult[];
}

export async function matchById(matchServiceId: string, id: string): Promise<MatchResponse> {
  return client
    .post(`/match-by-id/${matchServiceId}`, {
      id: id,
      numNeighbors: 20,
    })
    .then((response) => response.data);
}

export async function matchByText(matchServiceId: string, text: string): Promise<MatchResponse> {
  return client
    .post(`/match-by-text/${matchServiceId}`, {
      text: text,
      numNeighbors: 20,
    })
    .then((response) => response.data);
}
