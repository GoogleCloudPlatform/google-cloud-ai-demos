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

// ImageClassificationLandingPage.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import DemoWrapper from 'common/components/DemoWrapper';
import { matchingEngineDemoInfo } from 'DemoInfo';
import React from 'react';
import {
  getItemsImages,
  getItemsWords,
  getMatchRegistry,
  matchByIdWords,
  matchByTextWords,
} from 'stories/matching-engine/mocks/handlers';

export default {
  title: 'matching-engine/pages/MatchingEngineLandingPage',
  component: DemoWrapper,
} as ComponentMeta<typeof DemoWrapper>;

const Template: ComponentStory<typeof DemoWrapper> = () => (
  <DemoWrapper {...matchingEngineDemoInfo} initialTabIndex={1} />
);

export const Mocked = Template.bind({});
Mocked.parameters = {
  msw: { handlers: [getMatchRegistry, getItemsImages, getItemsWords, matchByIdWords, matchByTextWords] },
};

export const Default = Template.bind({});
