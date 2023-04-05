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

import { Alert, CircularProgress } from '@mui/material';
import { AxiosError } from 'axios';
import { ParameterDict } from 'demos/time-series-forecasting/models';
import { ForecastJob, SubmitForecastJobResponse } from 'demos/time-series-forecasting/models';
import ForecastJobCard from 'demos/time-series-forecasting/pages/forecast-jobs/ForecastJobCard';
import { getForecastJob, submitForecastJob } from 'demos/time-series-forecasting/queries/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

export interface JobResultProp {
  trainingMethodId: string;
  datasetId: string;
  modelParameters: ParameterDict;
  predictionParameters: ParameterDict;
}

export default ({ trainingMethodId, datasetId, modelParameters, predictionParameters }: JobResultProp) => {
  const { isLoading, error, data, isError } = useQuery<SubmitForecastJobResponse, Error>(
    ['submitForecast'],
    () => {
      return submitForecastJob(trainingMethodId, datasetId, modelParameters, predictionParameters);
    },
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const jobId = data?.jobId;

  const [refetchInterval, setRefetchInterval] = React.useState(5000);

  const {
    isLoading: isForecastJobLoading,
    isError: isForecastJobError,
    data: forecastJob,
    error: forecastJobError,
  } = useQuery<ForecastJob>(
    ['jobId', jobId],
    () => {
      return getForecastJob(jobId);
    },
    {
      // The query will not execute until the jobId exists
      enabled: !!jobId,
      // The query will refetch on the specified interval
      refetchInterval: refetchInterval,
      // The query will stop refetching on the success
      onSuccess: (forecastJob) => {
        if (forecastJob.endTime != null) {
          setRefetchInterval(0);
        }
      },
    }
  );

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (jobId != null) {
    if (isForecastJobLoading) {
      return (
        <Alert icon={<CircularProgress size={3} />} severity="info">
          Loading...
        </Alert>
      );
    } else if (forecastJob != null) {
      return (
        <ForecastJobCard
          jobId={forecastJob.request.jobId}
          request={forecastJob.request}
          endTime={forecastJob.endTime}
          errorMessage={forecastJob.errorMessage}
        />
      );
    } else if (isForecastJobError && forecastJobError) {
      return (
        <Alert icon={<CircularProgress size={3} />} severity="error">
          {(error as AxiosError).message}
        </Alert>
      );
    } else {
      return null;
    }
  } else if (isError && error != null) {
    return <Alert severity="error">{error.message}</Alert>;
  } else {
    return <Alert severity="error">Unknown error</Alert>;
  }
};
