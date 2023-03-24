/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';

const analytics = Analytics({
  app: 'ai-demos',
  plugins: [
    googleAnalytics({
      measurementIds: [process.env.REACT_APP_GA_MEASUREMENT_ID],
    }),
  ],
});

/* export the instance for usage in your app */
export default analytics;
