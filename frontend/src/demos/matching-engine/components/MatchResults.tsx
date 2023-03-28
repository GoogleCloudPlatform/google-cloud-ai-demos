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
import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { MatchResultsTable } from 'demos/matching-engine/components/MatchResultsTable';
import { matchByText, MatchResponse } from 'demos/matching-engine/queries';
import * as React from 'react';
import { useMutation } from 'react-query';

export interface MatchResultsProps {
  matchServiceId: string;
  selectedId?: string;
  searchQuery: string;
}

export const MatchResults = ({ matchServiceId, searchQuery }: MatchResultsProps) => {
  const [startTime, setStartTime] = React.useState<number | null>(null); // Initialize the startTime variable
  const [latency, setLatency] = React.useState<number>(-1);

  const {
    mutate: performMatch,
    isLoading,
    error,
    data: matchResults,
  } = useMutation<MatchResponse, Error, string>(
    (query: string) => {
      console.log(`Performing match: matchServiceId = ${matchServiceId}, searchQuery = ${query}`);

      if (query.length > 0) {
        return matchByText(matchServiceId, query);
      } else {
        throw new Error('No query provided');
      }
    },
    {
      onMutate: () => {
        setStartTime(Date.now());
      },
    }
  );

  React.useEffect(() => {
    performMatch(searchQuery);
  }, [searchQuery, performMatch]);

  React.useEffect(() => {
    // performMatch();
    if (startTime != null && matchResults != null) {
      setLatency(Date.now() - startTime);
    }
  }, [startTime, matchResults]);

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (matchResults != null) {
    return (
      <Stack spacing={2}>
        <Typography variant="body1">These are the closest matches for your selected item.</Typography>
        <Typography variant="subtitle2">
          {`${matchResults.results.length} results retrieved from a total of ${
            matchResults.totalIndexCount
          } items in ${latency.toFixed(0)} ms.`}
        </Typography>
        <MatchResultsTable results={matchResults.results} />
      </Stack>
    );
  } else if (error != null) {
    return <Alert severity="info">{(error as AxiosError).message}</Alert>;
  } else {
    return <Alert severity="error">Unknown error</Alert>;
  }
};
