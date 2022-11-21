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
