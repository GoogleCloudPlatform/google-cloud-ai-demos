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
import { SearchResultsTable } from './SearchResultsTable';
import { matchByText, MatchResponse } from '../queries';
import * as React from 'react';
import { useMutation } from 'react-query';
import Alert from 'common/components/Alert';

export interface MatchResultsProps {
  serviceId: string;
  selectedId?: string;
  searchQuery: string;
}

export const SearchResults = ({ serviceId, searchQuery }: MatchResultsProps) => {
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [latency, setLatency] = React.useState<number>(-1);

  const {
    mutate: performMatch,
    isLoading,
    error,
    data: matchResults,
  } = useMutation<MatchResponse, Error, string>(
    (query: string) => {
      console.log(`Performing match: serviceId = ${serviceId}, searchQuery = ${query}`);

      if (query.length > 0) {
        return matchByText(serviceId, query);
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
    if (startTime != null && matchResults != null) {
      setLatency(Date.now() - startTime);
    }
  }, [startTime, matchResults]);

  if (isLoading) {
    return <Alert mode="loading" title="Loading..." />;
  } else if (matchResults != null) {
    return (
      <div className="space-y-2">
        <p className="text-base">These are the closest matches for your selected item.</p>
        <p className="text-sm text-gray-600">
          {`${matchResults.results.length} results retrieved from a total of ${
            matchResults.totalIndexCount
          } items in ${latency.toFixed(0)} ms.`}
        </p>
        <SearchResultsTable results={matchResults.results} />
      </div>
    );
  } else if (error != null) {
    return <Alert mode="error" title="Error" subtitle={(error as Error).message} />;
  } else {
    return <Alert mode="error" title="Unknown error" />;
  }
};
