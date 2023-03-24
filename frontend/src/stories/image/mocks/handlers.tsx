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

import getImageClassificationResultsJSON from './getImageClassificationResults.json';
import getImagesJSON from './getImages.json';

const backendApi = (path: string) => {
  return new URL(path, process.env.REACT_APP_API_SERVER_MATCHING_ENGINE).toString();
};

export const getImages = rest.get(backendApi('images'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getImagesJSON));
});

export const getImageClassificationResults = rest.post(backendApi('classify-image'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getImageClassificationResultsJSON));
});
