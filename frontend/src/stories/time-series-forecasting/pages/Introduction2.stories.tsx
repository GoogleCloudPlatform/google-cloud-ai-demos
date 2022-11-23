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

// Introduction.stories.tsx

import { ComponentMeta, ComponentStory } from '@storybook/react';
import Introduction2 from 'demos/time-series-forecasting/pages/Introduction2';
import React from 'react';

export default {
  title: 'time-series-forecasting/pages/Introduction2',
  component: Introduction2,
} as ComponentMeta<typeof Introduction2>;

const Template: ComponentStory<typeof Introduction2> = () => <Introduction2 />;
export const Default = Template.bind({});
