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

import { LayoutWithRouter } from 'App';

import { initialize, mswDecorator } from 'msw-storybook-addon';

import { QueryClient, QueryClientProvider } from 'react-query';

import { DemoTheming } from 'common/components/DemoWrapper';

import 'index.css';

const queryClient = new QueryClient();

// Initialize MSW
initialize();

export const decorators = [
  mswDecorator,
  (Story) => (
    <LayoutWithRouter>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <DemoTheming>
        <Story />
      </DemoTheming>
    </LayoutWithRouter>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
