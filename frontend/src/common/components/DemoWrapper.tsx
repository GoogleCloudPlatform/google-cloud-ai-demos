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

import { Box, Container, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import ForecastingExamples from 'demos/time-series-forecasting/pages/ForecastingExamples';
import { ReactComponent as TimeSeriesArchitectureImage } from 'demos/time-series-forecasting/static/architecture.svg';
import React from 'react';
import GitHubButton from 'react-github-btn';
import theme from 'theme/demoTheme';

interface DemoThemingProps {
  children: React.ReactNode;
}

// The theme wrapper for the demos
export const DemoTheming = ({ children }: DemoThemingProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

interface DemoContentProps {
  tab: string;
  children: React.ReactNode;
}

const DemoContent = ({ tab, children }: DemoContentProps) => {
  if (tab == 'demo') {
    return <DemoTheming>{children}</DemoTheming>;
  } else if (tab == 'how') {
    return (
      <DemoTheming>
        <Container maxWidth="xl">
          <Grid container spacing={7}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Architecture</Typography>
              <Typography variant="body1">
                The demo consists of a React frontend served via nginx and hosted on Cloud Run.
              </Typography>
              <br />
              <Typography variant="overline">Frontend</Typography>
              <Typography variant="body2">
                The frontend is built using React and Material UI. It is served using NGINX. This is then containerized
                and served on Cloud Run.
              </Typography>
              <br />
              <Typography variant="overline">Backend</Typography>
              <Typography variant="body2">
                The backend is a Python app served using FastAPI. It uses a threadpool to handle multiple training
                requests in parallel. This is then containerized and deployed on Cloud Run.
              </Typography>
              <br />
              <Typography variant="overline">Machine learning</Typography>
              <Typography variant="body2">
                The demo supports a variety of model types, including BigQueryML and Vertex AI Time-series Forecasting.
                These are called on demand as forecast requests are received.
              </Typography>
              <br />
              <Typography variant="h6">Deploy</Typography>
              <Typography variant="body1">See the Github repo for deployment instructions</Typography>
              <GitHubButton
                href="https://github.com/ivanmkc/forecasting-live-demo-frontend"
                data-size="large"
                data-show-count="true"
                aria-label="Star ivanmkc/forecasting-live-demo-frontend on GitHub"
              >
                Star
              </GitHubButton>
            </Grid>
            <Grid xs={12} md={8}>
              {/* <Box padding={7}> */}
              <SvgIcon
                component={TimeSeriesArchitectureImage}
                inheritViewBox
                sx={{ m: '12px', height: '400px', width: '800px' }}
              />
              {/* </Box> */}
            </Grid>
          </Grid>
        </Container>
      </DemoTheming>
    );
  } else {
    return (
      <DemoTheming>
        <ForecastingExamples />
      </DemoTheming>
    );
  }
};

interface DemoWrapperProps {
  initialTab?: string;
  children: React.ReactElement;
}

const DemoWrapper = ({ initialTab, children }: DemoWrapperProps) => {
  const [tab, setTab] = React.useState(initialTab ?? 'learn');

  const handleChange = (event: React.MouseEvent<HTMLElement>, newTab: string) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  const getHeaderText = (tab: string): string => {
    switch (tab) {
      case 'learn':
        return 'Follow along these scenarios to see how forecasting is used in a variety of industries';
        break;
      case 'demo':
        return 'This is a demo web app for forecasting';
        break;
      case 'how':
        return 'This shows the architecture for the demo web app';
      default:
        return '';
    }
  };

  return (
    <Stack spacing={0} height="100%" direction="column">
      <Stack spacing={3} padding={4} flex="none" sx={{ marginBottom: '24px' }}>
        <Typography variant="h2" align="center">
          Time-series Forecasting
        </Typography>
        <Typography variant="subtitle1" align="center">
          This live demo showcases a forecasting app built with React, Material UI, Google Cloud Run, Google Cloud
          BigQuery and Google Cloud Vertex AI.
        </Typography>
        <Box alignSelf="center">
          <ToggleButtonGroup color="primary" value={tab} exclusive onChange={handleChange}>
            <ToggleButton value="learn">Learn about forecasting</ToggleButton>
            <ToggleButton value="demo">Try the demo</ToggleButton>
            <ToggleButton value="how">How we built it</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
      <Box sx={{ backgroundColor: '#1414460d' }} flex="1 1 0" paddingTop={2}>
        <Divider
          component="div"
          role="presentation"
          sx={{
            '&::before, &::after': {
              borderColor: theme.palette.grey[300],
            },
            width: '100%',
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <Typography variant="body2">{getHeaderText(tab)}</Typography>
        </Divider>
        <Box padding={3} marginTop={3}>
          <DemoContent tab={tab}>{children}</DemoContent>
        </Box>
      </Box>
    </Stack>
  );
};

export default DemoWrapper;
