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

import getItemsImagesJSON from './getItemsImages.json';
import getItemsWordsJSON from './getItemsWords.json';
import getMatchRegistryJSON from './getMatchRegistry.json';
import matchResultsImagesJSON from './matchResultsImages.json';

const backendApi = (path: string) => {
  return new URL(path, process.env.REACT_APP_API_SERVER_MATCHING_ENGINE).toString();
};

export const getMatchRegistry = rest.get(backendApi('match-registry'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getMatchRegistryJSON));
});

export const getItemsWords = rest.get(backendApi('items/words'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getItemsWordsJSON));
});

export const getItemsImages = rest.get(backendApi('items/images'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getItemsImagesJSON));
});

export const matchByIdWords = rest.post(backendApi('match-by-id/words'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(matchResultsImagesJSON));
});

export const matchByTextWords = rest.post(backendApi('match-by-text/words'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(matchResultsImagesJSON));
});
