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

import { Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { MoreInfoCardProps } from 'common/components/MoreInfoCard';
import PredictionPlot from 'common/components/prediction-plots/RechartsPredictionPlot';
import skis1JSON from 'demos/time-series-forecasting/pages/explanations/sample-data/skis1_2019.json';
import swimsuit1JSON from 'demos/time-series-forecasting/pages/explanations/sample-data/swimsuit1_2019.json';
import * as React from 'react';

export const PlottingStepInfo: MoreInfoCardProps = {
  title: 'More info',
  subtitle: 'Learn more about BigQuery ML',
  rows: [
    {
      text: 'BigQuery for Machine Learning',
      link: 'https://www.cloudskillsboost.google/quests/71',
    },
    {
      text: 'Predict Taxi Fare with a BigQuery ML Forecasting Model',
      link: 'https://www.cloudskillsboost.google/focuses/1797?parent=catalog',
    },
    {
      text: 'The CREATE MODEL statement for time series models',
      link: 'https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-create-time-series',
    },
  ],
};

export const PlottingStep = () => {
  const theme = useTheme();
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body1">
          Your data must be formatted into rows specific to what you want to forecast.
        </Typography>
        <br />
        <Typography variant="body1">
          Since you are interested in forecasting the number of sales of each product at each store, your data should be
          formatted such that there is a unique time series for each product-store combination. In the sample dataset,
          there are 2 products sold across 3 stores. Hence, there are a total of 6 unique times series. Each time-series
          will have one row for each date that there is data for. All of these time series are then concatenated into
          one table for forecasting.
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Typography variant="h5">Historical sales data for skis and swimwear</Typography>
        <Typography variant="body2">
          Note that each product has 3 time series, which corresponds to the three stores where each product is sold.
        </Typography>
        <Grid container sx={{ height: '300px' }}>
          <Grid xs={12} sm={4} sx={{ borderLeft: `2px solid ${theme.palette.grey[300]}`, paddingLeft: '24px' }}>
            <Typography variant="h6">Skis sales for 2021</Typography>
            <br />
            <Typography variant="body2">
              Notice the slump in sales around <b>summer</b> and a resurgence in the <b>winter</b>
            </Typography>
          </Grid>
          <Grid xs={12} sm={8} height="100%">
            {/* <Typography variant="overline" align="right">
              Skis sales for 2021
            </Typography> */}
            <PredictionPlot
              groups={skis1JSON.groups}
              data={skis1JSON.data}
              historyMaxDate={skis1JSON.historyMaxDate || undefined}
            />
          </Grid>
        </Grid>
        <Grid container sx={{ height: '300px' }}>
          <Grid xs={12} sm={4} sx={{ borderLeft: `2px solid ${theme.palette.grey[300]}`, paddingLeft: '24px' }}>
            <Typography variant="h6">Swimwear sales for 2021</Typography>
            <br />
            <Typography variant="body2">
              Notice the slump in sales around <b>winter</b> and a resurgence in the <b>summer</b>
            </Typography>
          </Grid>
          <Grid xs={12} sm={8} height="100%">
            {/* <Typography variant="overline">Swimwear sales for 2021</Typography> */}

            <PredictionPlot
              groups={swimsuit1JSON.groups}
              data={swimsuit1JSON.data}
              // historyMinDate={swimsuit1JSON.historyMinDate}
              historyMaxDate={swimsuit1JSON.historyMaxDate || undefined}
            />
          </Grid>
        </Grid>
        <br />
      </Grid>
    </Grid>
  );
};
