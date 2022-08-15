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
import ForecastJobs from 'demos/time-series-forecasting/pages/forecast-jobs/ForecastJobs';
import React from 'react';
import {
  getCompletedJobs,
  getEvaluation,
  getEvaluationNotFound,
  getPendingJobs,
  getPrediction,
  getPredictionNotFound,
} from 'stories/time-series-forecasting/mocks/handlers';

export default {
  title: 'time-series-forecasting/pages/ForecastJobs',
  component: ForecastJobs,
} as ComponentMeta<typeof ForecastJobs>;

const Template: ComponentStory<typeof ForecastJobs> = () => <ForecastJobs />;
export const MockedSuccess = Template.bind({});
MockedSuccess.parameters = {
  msw: { handlers: [getPendingJobs, getCompletedJobs, getEvaluation, getPrediction] },
};

export const MockedEvalPredictionNotFound = Template.bind({});
MockedEvalPredictionNotFound.parameters = {
  msw: { handlers: [getPendingJobs, getCompletedJobs, getEvaluationNotFound, getPredictionNotFound] },
};
