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

import { StyledEngineProvider } from '@mui/material';
import DemoWrapper from 'common/components/DemoWrapper';
import DemoSelection from 'common/pages/DemoSelection';
import { forecastingDemoInfo, matchingEngineDemoInfo } from 'DemoInfo';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useAnalytics } from 'use-analytics';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const analytics = useAnalytics();

  React.useEffect(() => {
    analytics.page({
      url: location.pathname,
    });
  }, [location, analytics]);

  return (
    <Routes>
      <Route path="/" element={<DemoSelection />} />
      <Route path="/demos" element={<DemoSelection />} />
      <Route path="/demos/time-series-forecasting" element={<DemoWrapper {...forecastingDemoInfo} />} />
      <Route
        path="/demos/time-series-forecasting/new-forecast"
        element={<DemoWrapper {...forecastingDemoInfo} initialTabIndex={1} />}
      />
      {/* <Route path="/demos/image-classification" element={<DemoWrapper {...imageClassificationDemoInfo} />} /> */}
      <Route path="/demos/matching-engine" element={<DemoWrapper {...matchingEngineDemoInfo} />} />
    </Routes>
  );
};

interface AppProps {
  children: React.ReactNode;
}

export const LayoutWithRouter = ({ children }: AppProps) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </StyledEngineProvider>
    </Router>
  );
};

export default () => {
  return (
    <LayoutWithRouter>
      <AppRoutes />
    </LayoutWithRouter>
    // <Introduction />
  );
};
