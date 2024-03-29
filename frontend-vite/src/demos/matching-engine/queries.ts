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

const client = axios.create({ baseURL: import.meta.env.VITE_API_SERVER_MATCHING_ENGINE });
export interface SuggestionInfo {
  id?: string;
  image?: string;
  text?: string;
}

export interface SuggestionInfosResponse {
  items: SuggestionInfo[];
}

export async function getSuggestions(match_service_id: string): Promise<SuggestionInfosResponse> {
  return client.get(`items/${match_service_id}`).then((response) => response.data);
}

export interface SearchServiceInfo {
  id: string;
  name: string;
  description: string;
  allowsTextInput: boolean;
  allowsImageInput: boolean;
  code?: { url: string; title: string };
}

export async function getMatchServiceInfo(): Promise<SearchServiceInfo[]> {
  return client.get(`match-registry`).then((response) => response.data);
}

export interface SearchResult {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  distance: number;
}

export interface MatchResponse {
  totalIndexCount: number;
  results: SearchResult[];
}

export async function matchByText(matchServiceId: string, text: string): Promise<MatchResponse> {
  return client
    .post(`/match-by-text/${matchServiceId}`, {
      text: text,
      numNeighbors: 60,
    })
    .then((response) => response.data);
}



export async function matchByImage(
  matchServiceId: string,
  file: File,
  numNeighbors: number
): Promise<MatchResponse> {
  console.log("matchByImage", matchServiceId)

  const formData = new FormData();
  formData.append("image", file);
  formData.append("numNeighbors", numNeighbors.toString());

  return client
    .post(`/match-by-image/${matchServiceId}`, formData)
    .then((response) => response.data);
}

export async function matchByImageUrl(
  matchServiceId: string,
  imageUrl: string,
  numNeighbors: number
): Promise<MatchResponse> {
  console.log("matchByImageUrl", matchServiceId)

  return client
    .post(`/match-by-image-url/${matchServiceId}`, {imageUrl, numNeighbors})
    .then((response) => response.data);
}

export async function matchByImageCombined(
  matchServiceId: string,
  file: File | string,
  numNeighbors: number = 60,
): Promise<MatchResponse> {
  console.log("matchByImageCombined", matchServiceId)

  if (file instanceof File) {
    return matchByImage(matchServiceId, file, numNeighbors)
  } else if (typeof file === "string") {
    return matchByImageUrl(matchServiceId, file, numNeighbors)
  } else {
    throw Error("File is not the right format")
  }
}
