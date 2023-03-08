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
import { MatchResultsTable } from 'demos/matching-engine/components/MatchResultsTable';
import { matchById, matchByText, MatchResponse } from 'demos/matching-engine/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

export interface MatchResultsProps {
  matchServiceId: string;
  selectedId?: string;
  searchQuery: string;
}

export const MatchResults = ({ matchServiceId, selectedId, searchQuery }: MatchResultsProps) => {
  const [startTime, setStartTime] = React.useState<number | null>(null); // Initialize the startTime variable

  const {
    isLoading,
    error,
    data: matchResults,
    isError,
    isFetching,
    isFetched,
    dataUpdatedAt,
  } = useQuery<MatchResponse, Error>(
    ['match', selectedId, searchQuery],
    () => {
      setStartTime(Date.now());

      console.log(
        `Performing match: matchServiceId = ${matchServiceId}, textQuery = ${searchQuery}, selectedId = ${selectedId}`
      );

      if (searchQuery.length > 0) {
        return matchByText(matchServiceId, searchQuery);
      } else if (selectedId != null) {
        return matchById(matchServiceId, selectedId);
      } else {
        throw new Error('No selectedId or searchQuery provided');
      }
    },
    {
      // The query will not execute until the jobId exists
      // enabled: !!selectedId || !!textQuery,
      refetchOnWindowFocus: false,
    }
  );

  let latency = 0;
  if (matchResults != null && !isLoading && !isFetching && startTime != null) {
    latency = dataUpdatedAt - (startTime as number);
  }

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
  } else if (isError && error != null) {
    return <Alert severity="error">{error.message}</Alert>;
  } else {
    return <Alert severity="error">Unknown error</Alert>;
  }
};
