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

import { Alert, Box, Button, Stack, SxProps, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

export interface StepContent {
  title: string;
  body: string;
}

interface NavigationButtonsProps {
  status?: string;
  isBackButtonHidden: boolean;
  isNextButtonHidden: boolean;
  isBackButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
  onBackButtonTapped: () => void;
  onNextButtonTapped: () => void;
}

const NavigationButtons = ({
  isBackButtonHidden,
  isNextButtonHidden,
  isBackButtonDisabled,
  isNextButtonDisabled,
  onBackButtonTapped,
  onNextButtonTapped,
}: NavigationButtonsProps) => {
  return (
    <Stack direction="row" flexDirection="row" justifyContent="flex-end" alignItems="center" spacing={4} width="100%">
      <Button
        variant="outlined"
        disabled={isBackButtonDisabled}
        onClick={onBackButtonTapped}
        sx={{ visibility: isBackButtonHidden ? 'hidden' : 'visible' }}
      >
        Back
      </Button>
      <Button
        variant="outlined"
        disabled={isNextButtonDisabled}
        onClick={onNextButtonTapped}
        sx={{ visibility: isNextButtonHidden ? 'hidden' : 'visible' }}
      >
        Next
      </Button>
    </Stack>
  );
};
interface StepWrapperProps {
  sx?: SxProps;
  header?: React.ReactNode;
  content?: StepContent;
  status?: string;
  onBackButtonTapped: () => void;
  onNextButtonTapped: () => void;
  isBackButtonHidden: boolean;
  isNextButtonHidden: boolean;
  isBackButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
  children: React.ReactNode;
}

export const StepWrapper = ({
  sx,
  header,
  content,
  status,
  onBackButtonTapped,
  onNextButtonTapped,
  isBackButtonHidden,
  isNextButtonHidden,
  isBackButtonDisabled,
  isNextButtonDisabled,
  children,
}: StepWrapperProps) => {
  return (
    <Grid container sx={{ ...{ height: '100%' }, ...sx }} rowSpacing={3}>
      {header != null ? <Grid xs={12}>{header}</Grid> : null}
      {content != null ? (
        <Box
          sx={{
            justifyContent: 'space-between',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
            <Typography variant="h3">{content.title}</Typography>
          </Box>
          {/* <Typography variant="body1">{content.body}</Typography> */}
          <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
            <NavigationButtons
              status={status}
              isBackButtonHidden={isBackButtonHidden}
              isNextButtonHidden={isNextButtonHidden}
              isBackButtonDisabled={isBackButtonDisabled}
              isNextButtonDisabled={isNextButtonDisabled}
              onBackButtonTapped={onBackButtonTapped}
              onNextButtonTapped={onNextButtonTapped}
            />
          </Box>
        </Box>
      ) : null}
      <Grid xs={12} spacing={0}>
        <Stack sx={{ height: '100%' }} spacing={2}>
          {status != null ? <Alert severity="error">{status}</Alert> : null}
          {children}
          {status != null ? <Alert severity="error">{status}</Alert> : null}
          <NavigationButtons
            isBackButtonHidden={isBackButtonHidden}
            isNextButtonHidden={isNextButtonHidden}
            isBackButtonDisabled={isBackButtonDisabled}
            isNextButtonDisabled={isNextButtonDisabled}
            onBackButtonTapped={onBackButtonTapped}
            onNextButtonTapped={onNextButtonTapped}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};
