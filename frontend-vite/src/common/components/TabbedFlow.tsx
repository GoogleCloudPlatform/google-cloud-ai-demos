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

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { MoreInfoCard, MoreInfoCardProps } from 'common/components/MoreInfoCard';
import * as React from 'react';

export interface ExplanationFlowStep {
  name: string;
  node: React.ReactNode;
  info?: MoreInfoCardProps;
}

interface StepWrapperProps {
  moreInfoCardProps?: MoreInfoCardProps;
  children: React.ReactNode;
}
const StepWrapper = ({ moreInfoCardProps, children }: StepWrapperProps) => {
  return (
    <Grid container spacing={3} margin={0} padding={0}>
      <Grid xs={12}>{children}</Grid>
      <Grid xs={12}>{moreInfoCardProps != null ? <MoreInfoCard {...moreInfoCardProps} /> : null}</Grid>
    </Grid>
  );
};

interface TabbedFlowProps {
  steps: ExplanationFlowStep[];
}

export const TabbedFlow = ({ steps }: TabbedFlowProps) => {
  const [value, setValue] = React.useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const theme = useTheme();

  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
        <TabList onChange={handleChange}>
          {steps.map((step, index) => {
            return <Tab key={index} label={step.name} value={index.toString()} />;
          })}
        </TabList>
      </Box>

      {steps.map((step, index) => {
        return (
          <TabPanel
            key={index}
            value={index.toString()}
            sx={{
              p: '0px',
            }}
          >
            <StepWrapper moreInfoCardProps={step.info}>{step.node}</StepWrapper>
          </TabPanel>
        );
      })}
    </TabContext>
  );
};
