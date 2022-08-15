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

import { Alert, AlertTitle, Avatar, Box, CardContent, CircularProgress, Icon, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import EvaluationDataGrid from 'common/components/EvaluationDataGrid';
import ParametersTable from 'common/components/ParametersTable';
import PredictionPlotForJob from 'demos/time-series-forecasting/components/PredictionPlotForJob';
import { ForecastJob, JobRequest } from 'demos/time-series-forecasting/models';
import { DateTime, Duration } from 'luxon';
import * as React from 'react';

interface StatusBannerProps {
  isCompletedJob: boolean;
  duration: Duration;
  errorMessage?: string;
}

const StatusBanner = ({ isCompletedJob, duration, errorMessage }: StatusBannerProps) => {
  const durationString = `${duration.toFormat("hh 'hours and' mm 'minutes and' ss 'seconds'")}`;

  if (errorMessage) {
    return (
      <CardContent>
        <Box>
          <Alert severity="error">
            <AlertTitle>Forecast Result</AlertTitle>
            Prediction failed in {durationString} with message: &apos;{errorMessage}&apos;
          </Alert>
        </Box>
      </CardContent>
    );
  } else if (isCompletedJob) {
    return (
      <CardContent>
        <Box>
          <Alert severity="success">
            <AlertTitle>Forecast Result</AlertTitle>
            Forecast complete in {durationString}.
          </Alert>
        </Box>
      </CardContent>
    );
  } else {
    return (
      <CardContent>
        <Box>
          <Alert icon={<CircularProgress size={3} />} severity="info">
            <AlertTitle>Forecast Result</AlertTitle>
            {`Please wait. Job has been running for ${duration.toFormat(
              "hh 'hours and' mm 'minutes and' ss 'seconds'."
            )}`}
          </Alert>
        </Box>
      </CardContent>
    );
  }
};

interface ForecastCompletedJobCardProps {
  jobId: string;
  request: JobRequest;
  endTime?: string;
  errorMessage?: string;
  onForecastJobSelected?: (job: ForecastJob) => void;
}

export default ({ jobId, request, endTime, errorMessage }: ForecastCompletedJobCardProps) => {
  const startTime = DateTime.fromISO(request.startTime);
  const isComplete = endTime != null && errorMessage == null;
  const endTimeActual = isComplete ? DateTime.fromISO(endTime) : DateTime.now();
  const duration = endTimeActual.diff(startTime);

  return (
    <CustomCard
      key={jobId}
      sx={{ width: '100%' }}
      avatar={
        <Avatar>
          <Icon>{request.dataset.icon}</Icon>
        </Avatar>
      }
      title={request.dataset.displayName}
      subheader={request.trainingMethodId.toUpperCase()}
      action={<Typography variant="caption">{`Started on ${startTime.toFormat('yyyy LLL dd HH:mm:ss')}`}</Typography>}
    >
      <StatusBanner isCompletedJob={isComplete} duration={duration} errorMessage={errorMessage} />

      <CardContent>
        <Grid container spacing={4}>
          <Grid md={12} lg={6}>
            <Typography variant="h5" gutterBottom>
              Model parameters
            </Typography>
            <ParametersTable parameters={request.modelParameters} />
          </Grid>
          <Grid md={12} lg={6}>
            <Typography variant="h5" gutterBottom>
              Prediction parameters
            </Typography>
            <ParametersTable parameters={request.predictionParameters} />
          </Grid>
        </Grid>
      </CardContent>

      {isComplete ? (
        <Box>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Evaluation
            </Typography>
            <EvaluationDataGrid jobId={request.jobId} />
          </CardContent>

          <CardContent>
            <Typography variant="h5" gutterBottom>
              Plot
            </Typography>
            <div style={{ height: '600px' }}>
              <PredictionPlotForJob jobId={request.jobId} />
            </div>
          </CardContent>
        </Box>
      ) : null}
    </CustomCard>
  );
};
