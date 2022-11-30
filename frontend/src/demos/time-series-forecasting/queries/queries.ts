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
import {
  DataGridData,
  DatasetFull,
  ForecastJob,
  JobRequest,
  ParameterDict,
  PlotlyPredictionAPIResponse,
  SubmitForecastJobResponse,
} from 'demos/time-series-forecasting/models';

const client = axios.create({ baseURL: process.env.REACT_APP_API_SERVER_TIME_SERIES_FORECASTING });

export async function getForecastJob(jobId?: string): Promise<ForecastJob> {
  return typeof jobId == null
    ? Promise.reject(new Error('Invalid jobId'))
    : client.get(`/forecast-job/${jobId}`).then((response) => response.data);
}

export async function submitForecastJob(
  trainingMethodId: string,
  datasetId: string,
  modelParameters: ParameterDict,
  predictionParameters: ParameterDict
): Promise<SubmitForecastJobResponse> {
  return client
    .post('/submit-forecast-job', {
      trainingMethodId: trainingMethodId,
      datasetId: datasetId,
      modelParameters: modelParameters,
      predictionParameters: predictionParameters,
    })
    .then((response) => response.data);
}

export async function fetchDatasets(): Promise<DatasetFull[]> {
  return client.get(`/datasets`).then((response) => response.data);
}

export async function fetchEvaluation(jobId: string): Promise<DataGridData> {
  return client.get(`/evaluation/${jobId}`).then((response) => response.data);
}

export async function fetchPendingJobs(): Promise<JobRequest[]> {
  return client.get(`/pending-jobs`).then((response) => response.data);
}

export async function fetchJobs(): Promise<ForecastJob[]> {
  return client.get('/jobs').then((response) => response.data);
}

export async function fetchPredictionPlot(jobId: string): Promise<PlotlyPredictionAPIResponse> {
  return client.get(`prediction/${jobId}/plotly`).then((response) => response.data);
}
