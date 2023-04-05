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

import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { MoreInfoCard, MoreInfoCardProps } from 'common/components/MoreInfoCard';
import * as React from 'react';

interface StepWrapperProps {
  onBackButtonTapped: () => void;
  onNextButtonTapped: () => void;
  isBackButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
  moreInfoCardProps?: MoreInfoCardProps;
  children: React.ReactNode;
}
export default ({
  onBackButtonTapped,
  onNextButtonTapped,
  isBackButtonDisabled,
  isNextButtonDisabled,
  moreInfoCardProps,
  children,
}: StepWrapperProps) => {
  return (
    <Grid container sx={{ p: 4, height: '100%' }} spacing={4}>
      <Grid xs={12} md={10} sx={{ height: '100%' }}>
        <Stack sx={{ height: '100%' }} spacing={2}>
          {children}

          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={4}>
            <Button variant="outlined" disabled={isBackButtonDisabled} onClick={onBackButtonTapped}>
              Back
            </Button>
            <Button variant="outlined" disabled={isNextButtonDisabled} onClick={onNextButtonTapped}>
              Next
            </Button>
          </Stack>
        </Stack>
      </Grid>
      {moreInfoCardProps != null ? (
        <Grid xs={12} md={2}>
          <MoreInfoCard {...moreInfoCardProps} />
        </Grid>
      ) : null}
    </Grid>
  );
};
