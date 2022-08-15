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

import { Box, Button, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import { MoreInfoCardProps } from 'common/components/MoreInfoCard';
import PredictionPlot from 'common/components/prediction-plots/RechartsPredictionPlot';
import predictionsLongJSON from 'demos/time-series-forecasting/pages/explanations/sample-data/predictions_skis_swimsuits_long.json';
import * as React from 'react';

export const ResultsStepInfo: MoreInfoCardProps = null;

export const ResultsStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body2">
          The forecast seems to have captured the weekly seasonality but not the longer term seasonality.
        </Typography>
        <br />
        <Typography variant="overline">Skis sales for 2021</Typography>
        <div style={{ height: '300px' }}>
          <PredictionPlot
            groups={predictionsLongJSON.groups}
            data={predictionsLongJSON.data}
            historyMinDate={predictionsLongJSON.historyMinDate}
            historyMaxDate={predictionsLongJSON.historyMaxDate}
            predictionsMinDate={predictionsLongJSON.predictionsMinDate || undefined}
            predictionsMaxDate={predictionsLongJSON.predictionsMaxDate || undefined}
          />
        </div>
      </Grid>
      <Grid xs={12} display="flex" justifyContent="center" alignItems="left">
        {/* <Typography variant="h5">That is all! Now try out a forecast on a dataset yourself.</Typography> */}
        <CustomCard>
          <CardContent>
            <Stack direction="column" spacing={2}>
              <Typography variant="h1">Try it yourself</Typography>
              <Typography variant="body1">Pick a demo dataset and try out forecasting with Vertex AI.</Typography>
              <Box>
                <Button
                  variant="contained"
                  disableElevation
                  href="/demos/forecasting/time-series/time-series-forecasting/new-forecast"
                  fullWidth={false}
                >
                  Start
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </CustomCard>
      </Grid>
    </Grid>
  );
};
