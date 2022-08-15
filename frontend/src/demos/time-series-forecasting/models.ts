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

export interface DataGridData {
  columns: string[];
  rows: { string: string | number }[];
}

// Type for parameters
export type ParameterDict = { [parameterName: string]: string | number };

export interface DatasetFull {
  id: string;
  icon: string;
  displayName: string;
  description: string;
  startDate: string;
  endDate: string;
  columns: string[];
  dfPreview: object[];
  recommendedModelParameters: { [modelKey: string]: ParameterDict };
  recommendedPredictionParameters: { [modelKey: string]: ParameterDict };
}

export interface Dataset {
  id: string;
  icon: string;
  displayName: string;
}

export interface JobRequest {
  jobId: string;
  trainingMethodId: string;
  dataset: Dataset;
  modelParameters: ParameterDict;
  predictionParameters: ParameterDict;
  startTime: string;
}

export interface SubmitForecastJobResponse {
  jobId: string;
}

export interface ForecastJob {
  request: JobRequest;
  endTime?: string;
  errorMessage?: string;
}

interface ChartJSDataset {
  label: string;
  data: number[];
}
export interface ChartJSPredictionAPIResponse {
  timeLabels: string[];
  datasets: ChartJSDataset[];
}

interface RechartsDataset {
  name: string;
}
export interface RechartsPredictionAPIResponse {
  groups: string[];
  data: RechartsDataset[];
  historyMaxDate?: string;
}

export interface PlotlyPredictionLine {
  x: string[];
  y: number[];
  name: string;
  mode: string;
}

interface HistoricalBounds {
  min: string;
  max: string;
}
export interface PlotlyPredictionAPIResponse {
  lines: PlotlyPredictionLine[];
  historicalBounds?: HistoricalBounds;
}
