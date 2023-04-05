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
import * as React from 'react';

export const MotivationStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body1">
          Imagine that you work for an outdoor goods store that sells products at 3 different stores around the city.
          You are in charge of determining what inventory to send to get store every month. If you send insufficient
          amounts of a product, then you may miss out of sales. Too many and it means you paid for product that you
          could not sell or that it took up space that another product could have used. Forecasting allows you to
          accurately predict your next month&#39;s sales to better guide these decisions.
        </Typography>
      </Grid>
    </Grid>
  );
};
