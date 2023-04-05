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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { MoreInfoCardProps } from 'common/components/MoreInfoCard';
import PredictionPlot from 'common/components/prediction-plots/RechartsPredictionPlot';
import skis1JSON from 'demos/time-series-forecasting/pages/explanations/sample-data/skis1_2019.json';
import * as React from 'react';

export const PatternsStepInfo: MoreInfoCardProps = {
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

interface ColumnInfo {
  name: string;
  description: string;
  example: string;
}

const COLUMN_INFOS = [
  {
    name: 'Long term trends',
    description: 'A product may increase and decrease in popularity over time.',
    example: 'Popularity in certain sports may increase as demographics change.',
  },
  {
    name: 'Weekly seasonality',
    description: 'Regular sales patterns may emerge over the course of the a week.',
    example: 'Sales may increase on weekends and decrease mid-week.',
  },
  {
    name: 'Annual seasonality',
    description: 'Regular sales patterns may emerge over the course of the a year.',
    example: 'Swimwear see increased sales during the summer months and decreased sales in the winter months.',
  },
  {
    name: 'Holiday effects',
    description: 'Holidays and special events can have an effect on sales',
    example: 'The period around Christmas typically sees an uptick in sales.',
  },
  {
    name: 'Promotional effects',
    description: 'Sales promotions that affect product prices and marketing may affect sales.',
    example: 'Discounts in swimwear increases sales during a sales campaign.',
  },
  {
    name: 'Independent variables, covariates and regressors',
    description:
      'These can be a value that changes over time (AKA a time-series) that directly affects or is correlated with the sales number. These must be known at the time the forecast is created.',
    example:
      'The rainfall level may affect sales of outdoor products. However, rainfall level can only be predicted accurately in the short-term, so forecasts cannot be made far out into the future if this variable is used. As another example, the varying sales price of a product will affect sales. Since this is decided the business, it may be a good predictor for longer-term forecasts.',
  },
];

interface ColumnInfoTableProps {
  columnInfos: ColumnInfo[];
}

const ColumnInfoTable = ({ columnInfos }: ColumnInfoTableProps) => {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{
        border: '1px solid',
        borderRadius: 2,
        borderColor: theme.palette.grey[300],
        '& pre': {
          m: 0,
          p: '16px !important',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.75rem',
        },
        boxShadow: null,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pattern</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Example</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columnInfos.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell align="right">{row.example}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const PatternsStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body1">
          In any time-series, it&#39;s typically to see periodic patterns. For example, you might see sales in of
          swimwear increase in the summer months and decrease in the winter. This sort of predictable, periodic behavour
          is called &#39;seasonality&#39;. Here are some some of the patterns that will typically appear in time-series
          data.
        </Typography>
        <br />
        <ColumnInfoTable columnInfos={COLUMN_INFOS} />
      </Grid>
      <Grid xs={12}>
        <Typography variant="h6">See if you can identify some of these patterns</Typography>
        <Typography variant="body2">
          In a well-trained model, these patterns will be inferred by the model and incorporated into the forecast.
        </Typography>
        <br />
        <Typography variant="overline">Skis sales for 2021</Typography>
        <div style={{ height: '300px' }}>
          <PredictionPlot
            groups={skis1JSON.groups}
            data={skis1JSON.data}
            historyMinDate={skis1JSON.historyMinDate}
            historyMaxDate={skis1JSON.historyMaxDate}
            predictionsMinDate={skis1JSON.predictionsMinDate || undefined}
            predictionsMaxDate={skis1JSON.predictionsMaxDate || undefined}
          />
        </div>
      </Grid>
    </Grid>
  );
};
