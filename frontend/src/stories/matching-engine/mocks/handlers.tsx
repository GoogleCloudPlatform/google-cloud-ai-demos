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

import { rest } from 'msw';

import fetchImageRecommendationResultsJSON from './fetchImageRecommendationResults.json';
import getImagesJSON from './getImages.json';
import getWordsJSON from './getWords.json';

const backendApi = (path: string) => {
  return new URL(path, process.env.REACT_APP_API_SERVER_IMAGE_RECOMMENDATION).toString();
};

export const getWords = rest.get(backendApi('text/items'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getWordsJSON));
});

export const getImages = rest.get(backendApi('images/items'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getImagesJSON));
});

export const matchWord = rest.post(backendApi('text/match'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(fetchImageRecommendationResultsJSON));
});
