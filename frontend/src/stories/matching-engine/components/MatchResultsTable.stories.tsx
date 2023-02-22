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

// MatchResultsTable.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MatchResultsTable } from 'demos/matching-engine/components/MatchResultsTable';
import React from 'react';
export default {
  title: 'matching-engine/components/MatchResultsTable',
  component: MatchResultsTable,
} as ComponentMeta<typeof MatchResultsTable>;

const Template: ComponentStory<typeof MatchResultsTable> = (args) => <MatchResultsTable {...args} />;

export const TextOnly = Template.bind({});
TextOnly.args = {
  results: [
    {
      text: 'burger',
      image: undefined,
      distance: 30,
    },
    {
      text: 'hats',
      image: undefined,
      distance: 30,
    },
  ],
};

export const TextAndImage = Template.bind({});
TextAndImage.args = {
  results: [
    {
      text: 'burger',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      distance: 30,
    },
    {
      text: 'hats',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      distance: 30,
    },
  ],
};
