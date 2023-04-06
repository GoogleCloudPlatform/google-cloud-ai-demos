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

import './index.css';

import analytics from 'AnalyticsService';
import App from 'App';
import AIDemosWrapper from 'common/components/BuiltOnVertexAIWrapper';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnalyticsProvider } from 'use-analytics';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <AnalyticsProvider instance={analytics}>
      <AIDemosWrapper>
        <App />
      </AIDemosWrapper>
    </AnalyticsProvider>
  </React.StrictMode>
);
