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

import { Alert, Box, CircularProgress, List, ListItem, Typography } from '@mui/material';
import { ForecastJob } from 'demos/time-series-forecasting/models';
import ForecastJobCard from 'demos/time-series-forecasting/pages/forecast-jobs/ForecastJobCard';
import { fetchJobs } from 'demos/time-series-forecasting/queries/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

interface JobsListProps {
  onForecastJobSelected?: (job: ForecastJob) => void;
}

const JobsList = ({ onForecastJobSelected }: JobsListProps) => {
  const {
    isLoading,
    error,
    data: jobs,
  } = useQuery<ForecastJob[], Error>(['fetchJobs'], fetchJobs, { refetchInterval: 5000 });

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (error !== null) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (jobs != null && jobs.length > 0) {
    return (
      <List>
        {jobs.map((job: ForecastJob) => (
          <ListItem
            key={job.request.jobId}
            sx={{
              listStyle: 'none',
              paddingLeft: 0,
            }}
          >
            <ForecastJobCard
              jobId={job.request.jobId}
              request={job.request}
              endTime={job.endTime}
              errorMessage={job.errorMessage}
              onForecastJobSelected={onForecastJobSelected}
            />
          </ListItem>
        ))}
      </List>
    );
  } else {
    return <Typography>No completed jobs</Typography>;
  }
};

export default () => {
  return (
    <Box color="primary">
      <Typography variant="h5">Forecast jobs</Typography>
      <JobsList />
    </Box>
  );
};
