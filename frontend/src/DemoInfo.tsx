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

import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import ImageClassificationFlow from 'demos/image-classification/pages/ImageClassificationFlow';
import MatchingEngineArchitecture from 'demos/matching-engine/pages/Architecture';
import MatchingEngineFlow from 'demos/matching-engine/pages/MatchingEngineFlow';
import ForecastingArchitecture from 'demos/time-series-forecasting/pages/ForecastingArchitecture';
import ForecastingExamples from 'demos/time-series-forecasting/pages/ForecastingExamples';
import NewForecastFlow from 'demos/time-series-forecasting/pages/new-forecast/NewForecastFlow';
import * as React from 'react';

export const forecastingDemoInfo = {
  title: 'Time-series Forecasting',
  subtitle:
    'This live demo showcases a forecasting app built with React, Material UI, Google Cloud Run, Google Cloud BigQuery and Google Cloud Vertex AI.',
  sections: [
    {
      buttonText: 'Learn about forecasting',
      title: 'Follow along these scenarios to see how forecasting is used in a variety of industries',
      element: <ForecastingExamples />,
    },
    {
      buttonText: 'Try the demo',
      title: 'This is a demo web app for forecasting',
      element: <NewForecastFlow />,
    },
    {
      buttonText: 'How we built it',
      title: 'This shows the architecture for the demo web app',
      element: <ForecastingArchitecture />,
    },
  ],
};

export const imageClassificationDemoInfo = {
  title: 'Image Classification',
  subtitle:
    'This live demo showcases a image classification app built with React, Material UI, Google Cloud Run and Google Cloud Vertex AI.',
  sections: [
    {
      buttonText: 'Learn about image classification',
      title: 'Follow along these scenarios to see how image classification is used in a variety of industries',
      element: (
        <Container>
          <Box>
            <Typography variant="h1">Image Classification</Typography>
            <Typography variant="body1">
              Image classification is a supervised learning problem: define a set of target classes (objects to identify
              in images), and train a model to recognize them using labeled example photos.
            </Typography>
            TODO: Show illustration here
            <Typography variant="h3">Industry use cases</Typography>
            <Typography variant="body1">Here are a few use cases for image classification.</Typography>
            TODO
          </Box>
        </Container>
      ),
    },
    {
      buttonText: 'Try the demo',
      title: 'This is a demo web app for image classification',
      element: <ImageClassificationFlow />,
    },
    {
      buttonText: 'How we built it',
      title: 'This shows the architecture for the demo web app',
      element: <Typography>TODO</Typography>,
    },
  ],
};

export const matchingEngineDemoInfo = {
  title: 'Vertex AI Matching Engine',
  subtitle:
    'Vertex AI Matching Engine provides high-scale low latency vector database (a.k.a, vector similarity-matching or approximate nearest neighbor service). Matching Engine provides tooling to build use cases that match semantically similar items.',
  sections: [
    // {
    //   buttonText: 'Learn about Vertex AI Matching Engine',
    //   title: 'Follow along these scenarios to see how matching engine is used in a variety of industries',
    //   element: <ExplanationFlow />,
    // },
    {
      buttonText: 'Try the demo',
      title: 'Get the closest matches based on your selected item.',
      element: <MatchingEngineFlow />,
    },
    {
      buttonText: 'How we built it',
      title: 'This shows the architecture for the demo web app',
      element: <MatchingEngineArchitecture />,
    },
  ],
};
