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

// MatchCard.stories.tsx

import { List, ListItem } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MatchCard } from 'demos/matching-engine/components/MatchCard';
import React from 'react';
export default {
  title: 'matching-engine/components/MatchCard',
  component: MatchCard,
} as ComponentMeta<typeof MatchCard>;

const Template: ComponentStory<typeof MatchCard> = (args) => {
  return (
    <List sx={{ backgroundColor: 'red' }}>
      <ListItem key={1} sx={{ backgroundColor: 'blue', justifyContent: 'center' }}>
        <MatchCard {...args} />
      </ListItem>
      <ListItem key={2} sx={{ justifyContent: 'center' }}>
        <MatchCard {...args} />
      </ListItem>
      <ListItem key={3} sx={{ justifyContent: 'center' }}>
        <MatchCard {...args} />
      </ListItem>
      <ListItem key={4} sx={{ justifyContent: 'center' }}>
        <MatchCard {...args} />
      </ListItem>
    </List>
  );
};

export const TextOnly = Template.bind({});
TextOnly.args = {
  text: 'burger',
  image: undefined,
  distance: 30,
};

export const TextAndImage = Template.bind({});
TextAndImage.args = {
  text: 'burger',
  image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  distance: 30,
};
