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

// PredictionPlot.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import PredictionPlotForJob from 'demos/time-series-forecasting/components/PredictionPlotForJob';
import React from 'react';
import {
  getPrediction,
  getPredictionNoHistoryMax,
  getPredictionNotFound,
} from 'stories/time-series-forecasting/mocks/handlers';

export default {
  title: 'time-series-forecasting/components/PredictionPlotForJob',
  component: PredictionPlotForJob,
} as ComponentMeta<typeof PredictionPlotForJob>;

const Template: ComponentStory<typeof PredictionPlotForJob> = (args) => <PredictionPlotForJob {...args} />;

export const Completed = Template.bind({});
Completed.args = {
  jobId: 'job_1234',
};
Completed.parameters = {
  msw: { handlers: [getPrediction] },
};

export const Error = Template.bind({});
Error.args = {
  jobId: 'job_1234',
};
Error.parameters = {
  msw: { handlers: [getPredictionNotFound] },
};

export const NoHistoryMax = Template.bind({});
NoHistoryMax.args = {
  jobId: 'job_1234',
};
NoHistoryMax.parameters = {
  msw: { handlers: [getPredictionNoHistoryMax] },
};
