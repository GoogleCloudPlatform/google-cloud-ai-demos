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
import codeSamples from 'demos/time-series-forecasting/pages/explanations/sample-data/codeSamples';
import * as React from 'react';
import { CodeBlock, dracula } from 'react-code-blocks';

export const ForecastStepInfo: MoreInfoCardProps = {
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
interface ModelParameterInfo {
  name: string;
  description: string;
  value: string;
}

const MODEL_PARAMETER_INFOS = [
  {
    name: 'TIME_SERIES_TIMESTAMP_COL',
    description: 'The column with the timestamp or date of each row.',
    value: 'date',
    rationale: 'The date column identifies the date at which each sales value corresponds to.',
  },
  {
    name: 'TIME_SERIES_DATA_COL',
    description: 'The column with the values you are trying to forecast.',
    value: 'sales',
    rationale: 'We are using past sales values to predict future sales values.',
  },
  {
    name: 'TIME_SERIES_ID_COL',
    description: 'The column identifying each unique time series.',
    value: 'product_at_store',
    rationale:
      'Since we are interested in predicting sales for each product at each store, we combine the product and store columns into a product_at_store column.',
  },
  {
    name: 'HORIZON',
    description: 'How many time steps to forecast into the future.',
    value: '240',
    rationale:
      'BigQueryML can infer that each timestep is represented by a day. Hence, 240 means to forecast 240 days into the future.',
  },
];

interface ModelParameterInfoTableProps {
  infos: ModelParameterInfo[];
}

const ModelParameterInfoTable = ({ infos }: ModelParameterInfoTableProps) => {
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
            <TableCell>Parameter</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Value</TableCell>
            <TableCell align="right">Rationale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {infos.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.value}</TableCell>
              <TableCell align="right">{row.rationale}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const ForecastStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body1">
          Now that your data is prepared, you must choose a forecasting method. This example shows what BigQueryML can
          do. BigQueryML makes it very easy to perform machine learning on data that is already stored in BigQuery. The
          ARIMA+ model is perfect for a forecasting use case like the one here.
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Typography variant="h6">Required parameters</Typography>
        <Typography variant="body2">
          The <b>ARIMA_PLUS</b> model takes several required parameters. For this dataset, here are the appropriate
          settings.
        </Typography>
        <br />
        <Typography variant="overline">BigQuery ML ARIMA_PLUS parameters</Typography>
        <ModelParameterInfoTable infos={MODEL_PARAMETER_INFOS} />
      </Grid>
      <Grid xs={12}>
        <Typography variant="h6">Code sample</Typography>
        <Typography variant="body2">
          The SQL code to perform this forecast is quite simple. This can be used directly in BigQuery SQL Workspace in
          the Google Cloud console.
        </Typography>
        <br />
        <Typography variant="overline">SQL code for creating a model</Typography>
        <CodeBlock text={codeSamples.retail.createBQMLModel} language={null} showLineNumbers={true} theme={dracula} />
      </Grid>
    </Grid>
  );
};
