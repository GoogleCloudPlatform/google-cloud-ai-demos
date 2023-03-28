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

import { Container, Typography } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import { ReactComponent as ArchitectureImage } from 'demos/matching-engine/static/architecture.svg';
import * as React from 'react';
import GitHubButton from 'react-github-btn';

export default () => (
  <Container maxWidth="xl">
    <Grid container spacing={7}>
      <Grid md={12} lg={4}>
        <Typography variant="h6">Architecture</Typography>
        <Typography variant="body1">
          The demo consists of a React frontend served via nginx and hosted on Cloud Run.
        </Typography>
        <br />
        <Typography variant="overline">Frontend</Typography>
        <Typography variant="body2">
          The frontend is built using React and Material UI. It is served using NGINX. This is then containerized and
          served on{' '}
          <a
            href="https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service"
            target="_blank"
            rel="noreferrer"
          >
            Cloud Run
          </a>
        </Typography>
        <br />
        <Typography variant="overline">Backend</Typography>
        <Typography variant="body2">
          The backend is a Python app served using FastAPI. It uses a threadpool to handle multiple training requests in
          parallel. This is then containerized and deployed on Cloud Run.
        </Typography>
        <br />
        <Typography variant="overline">Similarity Search</Typography>
        <Typography variant="body2">
          The demo uses{' '}
          <a href="https://cloud.google.com/vertex-ai/docs/matching-engine/overview" target="_blank" rel="noreferrer">
            Matching Engine
          </a>{' '}
          to do vector similarity search at scale. Matching Engine requires a{' '}
          <a href="https://cloud.google.com/vpc/docs/vpc" target="_blank" rel="noreferrer">
            VPC network
          </a>{' '}
          to perform search. Cloud Run connects to the VPC network by using a{' '}
          <a href="https://cloud.google.com/vpc/docs/serverless-vpc-access" target="_blank" rel="noreferrer">
            Serverless VPC connector
          </a>
        </Typography>
        <br />
        <Typography variant="overline">Memorystore</Typography>
        <Typography variant="body2">
          <a href="https://cloud.google.com/memorystore/docs/redis/redis-overview" target="_blank" rel="noreferrer">
            Memorystore
          </a>{' '}
          is a low-latency key-value database used to hydrate data that is retrieved from Matching Engine. For example,
          given a StackOverflow question id, Memorystore is used to retrieve the question title.
        </Typography>
        <br />
        <Typography variant="overline">Cloud Vision</Typography>
        <Typography variant="body2">
          <a href="https://cloud.google.com/vision" target="_blank" rel="noreferrer">
            Cloud Vision
          </a>{' '}
          is used to filter out explicit images for the text-to-image dataset.
        </Typography>
        <br />
        <Typography variant="h6">Deploy</Typography>
        <Typography variant="body1">See the Github repo for deployment instructions</Typography>
        <GitHubButton
          href="https://github.com/googlecloudplatform/google-cloud-ai-demos"
          data-size="large"
          data-show-count="true"
          aria-label="Star googlecloudplatform/google-cloud-ai-demos on GitHub"
        >
          Star
        </GitHubButton>
      </Grid>
      <Grid md={12} lg={8}>
        <SvgIcon
          onClick={() => window.open('demos/matching-engine/static/architecture.svg', '_blank')}
          component={ArchitectureImage}
          viewBox="0 0 2240 920"
          sx={{ minHeight: '500px', width: '100%' }}
        />
      </Grid>
    </Grid>
  </Container>
);
