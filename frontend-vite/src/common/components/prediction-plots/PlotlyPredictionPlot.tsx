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

import { Box } from '@mui/material';
import { PlotlyPredictionAPIResponse } from 'demos/time-series-forecasting/models';
import { Data } from 'plotly.js';
import * as React from 'react';
import Plot from 'react-plotly.js';

export default ({ lines, historicalBounds }: PlotlyPredictionAPIResponse) => {
  const data: Data[] = lines.map((line) => {
    return {
      x: line.x,
      y: line.y,
      name: line.name,
      mode: line.mode,
      text: line.name,
      xanchor: 'left',
      yanchor: 'middle',
    };
  });

  const selectorOptions = {
    buttons: [
      {
        step: 'month' as const,
        stepmode: 'backward' as const,
        count: 1,
        label: '1m',
      },
      {
        step: 'month' as const,
        stepmode: 'backward' as const,
        count: 6,
        label: '6m',
      },
      {
        step: 'year' as const,
        stepmode: 'todate' as const,
        count: 1,
        label: 'YTD',
      },
      {
        step: 'year' as const,
        stepmode: 'backward' as const,
        count: 1,
        label: '1y',
      },
      {
        step: 'all' as const,
      },
    ],
  };

  const shapes =
    historicalBounds != null
      ? [
          {
            type: 'line' as const,
            x0: historicalBounds.max,
            x1: historicalBounds.max,
            yref: 'paper' as const,
            y0: 0,
            y1: 1,
            line: {
              color: 'grey',
              width: 5,
              dash: 'dot' as const,
            },
          },
          {
            type: 'rect' as const,
            x0: historicalBounds.min,
            x1: historicalBounds.max,
            yref: 'paper' as const,
            y0: 0,
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.2,
            line: {
              width: 0,
            },
          },
        ]
      : [];

  const layout = {
    showlegend: true,
    // Anchor legend to the top-left
    // legend: { orientation: 'h' as const, yAnchor: 'bottom', y: 0, xAnchor: 'right', x: 0 },
    xaxis: {
      rangeselector: selectorOptions,
      rangeslider: {},
    },
    yaxis: {
      fixedrange: false,
    },
    autosize: true,
    shapes: shapes,
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Plot data={data} layout={layout} useResizeHandler style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};
