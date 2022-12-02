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

import BackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Divider, Toolbar } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ExplanationFlowStep, TabbedFlow } from 'common/components/TabbedFlow';
import * as React from 'react';

import { DatasetStep } from './DatasetStep';
import { ForecastStep } from './ForecastStep';
import { MoreInfo, MoreInfoStep } from './MoreInfoStep';
import { MotivationStep } from './MotivationStep';
import { PatternsStep } from './PatternsStep';
import { PlottingStep } from './PlottingStep';
import { ResultsStep } from './ResultsStep';

const steps: ExplanationFlowStep[] = [
  {
    name: 'Motivation',
    node: <MotivationStep key={0} />,
  },
  {
    name: 'Data',
    node: <DatasetStep key={1} />,
  },
  {
    name: 'Data Preparation',
    node: <PlottingStep key={2} />,
  },
  {
    name: 'Patterns',
    node: <PatternsStep key={3} />,
  },
  {
    name: 'Forecast Setup',
    node: <ForecastStep key={4} />,
  },
  {
    name: 'Results',
    node: <ResultsStep key={5} />,
  },
  {
    name: 'More Info',
    node: <MoreInfoStep key={6} />,
    info: MoreInfo,
  },
];

interface ExplanationFlowRetailProps {
  onBackButtonClicked?: () => void;
}

export default ({ onBackButtonClicked }: ExplanationFlowRetailProps) => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={9}>
        <Grid xs={12} height={4}>
          <Toolbar component={Box} sx={{ justifyContent: 'space-between', display: 'flex' }} disableGutters>
            <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
              {onBackButtonClicked != null ? (
                <Button variant="outlined" startIcon={<BackIcon />} onClick={onBackButtonClicked}>
                  More scenarios
                </Button>
              ) : null}
            </Box>
            {/* <Typography variant="overline">
            <b>RETAIL</b>
          </Typography> */}
            <Box sx={{ flexGrow: 1, flexBasis: 0 }}></Box>
          </Toolbar>
          <Divider />
        </Grid>
        <Grid xs={12}>
          <TabbedFlow steps={steps} />
        </Grid>
      </Grid>
    </Container>
  );
};
