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

import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { MoreInfoCardProps } from 'common/components/MoreInfoCard';
import * as React from 'react';

export const MoreInfo: MoreInfoCardProps = {
  title: 'BigQuery ML',
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

export const MoreInfoStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body2">Here are additional resources for forecasting.</Typography>
      </Grid>
    </Grid>
  );
};
