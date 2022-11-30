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
import getJobsJSON from 'stories/time-series-forecasting/mocks/getCompletedJobs.json';
import getDatasetsJSON from 'stories/time-series-forecasting/mocks/getDatasets.json';
import getEvaluationJSON from 'stories/time-series-forecasting/mocks/getEvaluation.json';
import getForecastJobJSON from 'stories/time-series-forecasting/mocks/getForecastJob.json';
import getForecastJobErrorJSON from 'stories/time-series-forecasting/mocks/getForecastJobError.json';
import getForecastJobPendingJSON from 'stories/time-series-forecasting/mocks/getForecastJobPending.json';
import getPendingJobsJSON from 'stories/time-series-forecasting/mocks/getPendingJobs.json';
import getPredictionJSON from 'stories/time-series-forecasting/mocks/getPrediction.json';
import getPredictionNoHistoryMaxJSON from 'stories/time-series-forecasting/mocks/getPredictionNoHistoryMax.json';

const backendApi = (path: string) => {
  return new URL(path, process.env.REACT_APP_API_SERVER_TIME_SERIES_FORECASTING).toString();
};

export const getDatasets = rest.get(backendApi('datasets'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getDatasetsJSON));
});

export const submitForecast = rest.post(backendApi('submit-forecast-job'), (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      jobId: '7x51fxdf',
    })
  );
});

export const getPendingJobs = rest.get(backendApi('pending-jobs'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getPendingJobsJSON));
});

export const getCompletedJobs = rest.get(backendApi('jobs'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getJobsJSON));
});

// Forecast Job
export const getForecastJob = rest.get(backendApi('forecast-job/:jobId'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getForecastJobJSON));
});
export const getForecastJobPending = rest.get(backendApi('forecast-job/:jobId'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getForecastJobPendingJSON));
});
export const getForecastJobError = rest.get(backendApi('forecast-job/:jobId'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getForecastJobErrorJSON));
});

export const getEvaluation = rest.get(backendApi('evaluation/:jobId'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getEvaluationJSON));
});

export const getEvaluationNotFound = rest.get(backendApi('evaluation/:jobId'), (req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({
      detail: 'Evaluation not found: 02paakhy',
    })
  );
});

export const getPrediction = rest.get(backendApi('prediction/:jobId/plotly'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getPredictionJSON));
});

export const getPredictionNoHistoryMax = rest.get(backendApi('prediction/:jobId/plotly'), (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(getPredictionNoHistoryMaxJSON));
});

export const getPredictionNotFound = rest.get(backendApi('prediction/:jobId/plotly'), (req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({
      detail: 'Prediction not found: 02paakhy',
    })
  );
});
