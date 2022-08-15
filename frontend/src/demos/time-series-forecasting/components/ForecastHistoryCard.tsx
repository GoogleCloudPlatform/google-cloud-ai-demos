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

import { Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import React from 'react';

const ForecastHistoryCard = () => {
  return (
    <Card css={{ height: '100%' }}>
      <CardContent>
        <Grid container>
          <Grid xs={2}>
            <Stack>
              <Typography component="div" variant="h5">
                Forecast date
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                Dataset name
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={10}>{/* <LinePlot /> */}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ForecastHistoryCard;
