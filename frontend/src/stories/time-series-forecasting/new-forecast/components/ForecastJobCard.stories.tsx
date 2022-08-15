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

// ForecastCompletedJobCard.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import ForecastJobCard from 'demos/time-series-forecasting/pages/forecast-jobs/ForecastJobCard';
import React from 'react';
import { getEvaluation, getPrediction } from 'stories/time-series-forecasting/mocks/handlers';

export default {
  title: 'time-series-forecasting/New Forecast/components/ForecastJobCard',
  component: ForecastJobCard,
} as ComponentMeta<typeof ForecastJobCard>;

const Template: ComponentStory<typeof ForecastJobCard> = (args) => <ForecastJobCard {...args} />;

export const Pending = Template.bind({});
Pending.args = {
  jobId: '02paakhy',
  request: {
    jobId: '02paakhy',
    trainingMethodId: 'bqml_arimaplus',
    dataset: {
      id: 't028rst4',
      icon: 'storefront',
      displayName: 'Retail Sales',
    },
    modelParameters: {
      timeColumn: 'date',
      targetColumn: 'sales',
      timeSeriesIdentifierColumn: 'product_at_store',
    },
    predictionParameters: {
      forecastHorizon: 10,
    },
    startTime: '2022-09-29T13:53:51.001414',
  },
};

export const Error = Template.bind({});
Error.args = {
  jobId: '02paakhy',
  request: {
    jobId: '02paakhy',
    trainingMethodId: 'bqml_arimaplus',
    dataset: {
      id: 't028rst4',
      icon: 'storefront',
      displayName: 'Retail Sales',
    },
    modelParameters: {
      timeColumn: 'date',
      targetColumn: 'sales',
      timeSeriesIdentifierColumn: 'product_at_store',
    },
    predictionParameters: {
      forecastHorizon: 10,
    },
    startTime: '2022-09-29T13:53:51.001414',
  },
  errorMessage: 'Wrong parameters',
};

export const Completed = Template.bind({});
Completed.args = {
  jobId: '02paakhy',
  request: {
    jobId: '02paakhy',
    trainingMethodId: 'bqml_arimaplus',
    dataset: {
      id: 't028rst4',
      icon: 'storefront',
      displayName: 'Retail Sales',
    },
    modelParameters: {
      timeColumn: 'date',
      targetColumn: 'sales',
      timeSeriesIdentifierColumn: 'product_at_store',
    },
    predictionParameters: {
      forecastHorizon: 10,
    },
    startTime: '2022-09-29T13:53:51.001414',
  },
  endTime: '2022-09-29T13:54:53.763688',
};
Completed.parameters = {
  msw: { handlers: [getEvaluation, getPrediction] },
};
