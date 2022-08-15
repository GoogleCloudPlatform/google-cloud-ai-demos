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

// JobResult.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import JobResult from 'demos/time-series-forecasting/pages/new-forecast/ForecastJobResult';
import React from 'react';
import {
  getEvaluation,
  getForecastJob,
  getForecastJobError,
  getForecastJobPending,
  getPrediction,
  submitForecast,
} from 'stories/time-series-forecasting/mocks/handlers';

export default {
  title: 'time-series-forecasting/New Forecast/pages/ForecastJobResult',
  component: JobResult,
} as ComponentMeta<typeof JobResult>;

const Template: ComponentStory<typeof JobResult> = (args) => <JobResult {...args} />;

export const Completed = Template.bind({});
Completed.args = {
  trainingMethodId: 'bqml_arimaplus',
  datasetId: 't028rst4',
  modelParameters: {
    timeColumn: 'date',
    targetColumn: 'sales',
    timeSeriesIdentifierColumn: 'product_at_store',
  },
  predictionParameters: {
    forecastHorizon: 10,
  },
};
Completed.parameters = {
  msw: { handlers: [submitForecast, getForecastJob, getEvaluation, getPrediction] },
};

export const Pending = Template.bind({});
Pending.args = {
  trainingMethodId: 'bqml_arimaplus',
  datasetId: 't028rst4',
  modelParameters: {
    timeColumn: 'date',
    targetColumn: 'sales',
    timeSeriesIdentifierColumn: 'product_at_store',
  },
  predictionParameters: {
    forecastHorizon: 10,
  },
};
Pending.parameters = {
  msw: { handlers: [submitForecast, getForecastJobPending] },
};

export const Error = Template.bind({});
Error.args = {
  trainingMethodId: 'bqml_arimaplus',
  datasetId: 't028rst4',
  modelParameters: {
    timeColumn: 'date',
    targetColumn: 'sales',
    timeSeriesIdentifierColumn: 'product_at_store',
  },
  predictionParameters: {
    forecastHorizon: 10,
  },
};
Error.parameters = {
  msw: { handlers: [submitForecast, getForecastJobError] },
};
