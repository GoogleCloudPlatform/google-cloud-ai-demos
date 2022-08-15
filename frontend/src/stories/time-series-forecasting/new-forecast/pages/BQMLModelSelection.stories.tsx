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

// BQMLModelSelection.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import BQMLModelSelection from 'demos/time-series-forecasting/pages/new-forecast/steps/ModelSelectionTypes/BQMLModelSelection';
import React from 'react';
import selectedDataset from 'stories/time-series-forecasting/mocks/dataset.json';

export default {
  title: 'time-series-forecasting/New Forecast/pages/BQMLModelSelection',
  component: BQMLModelSelection,
} as ComponentMeta<typeof BQMLModelSelection>;

const Template: ComponentStory<typeof BQMLModelSelection> = (args) => <BQMLModelSelection {...args} />;

export const Default = Template.bind({});
Default.args = {
  selectedDataset: selectedDataset,
  selectedModelParameters: {},
  selectedPredictionParameters: {},
};
