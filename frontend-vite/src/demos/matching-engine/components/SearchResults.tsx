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
import { matchByImageCombined, matchByText, MatchResponse } from '../queries';
import * as React from 'react';
import { useMutation } from 'react-query';
import Alert from 'common/components/Alert';
import SearchResultsGrid from './SearchResultsGrid';

export interface SearchResultsForTextQueryProps {
  serviceId: string;
  searchQuery: string;
  showLatency?: boolean;
}

export const SearchResultsForTextQuery = ({
  serviceId,
  searchQuery,
  showLatency = false,
}: SearchResultsForTextQueryProps) => {
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

  return (
    <SearchResults
      isLoading={isLoading}
      matchResults={matchResults}
      error={error ?? undefined}
      latency={showLatency ? latency : undefined}
    />
  );
};

export interface SearchResultsForImageQueryProps {
  serviceId: string;
  image?: File | string;
  showLatency?: boolean;
}

export const SearchResultsForImageQuery = ({
  serviceId,
  image,
  showLatency = false,
}: SearchResultsForImageQueryProps) => {
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [latency, setLatency] = React.useState<number>(-1);

  const {
    mutate: performMatch,
    isLoading,
    error,
    data: matchResults,
  } = useMutation<MatchResponse, Error, File | string | undefined>(
    (image?: File | string) => {
      if (image != null) {
        console.log(`Performing match: serviceId = ${serviceId}`);

        return matchByImageCombined(serviceId, image);
      } else {
        throw new Error('No image provided');
      }
    },
    {
      onMutate: () => {
        setStartTime(Date.now());
      },
    }
  );

  React.useEffect(() => {
    performMatch(image);
  }, [image, performMatch]);

  React.useEffect(() => {
    if (startTime != null && matchResults != null) {
      setLatency(Date.now() - startTime);
    }
  }, [startTime, matchResults]);

  return (
    <SearchResults
      isLoading={isLoading}
      matchResults={matchResults}
      error={error ?? undefined}
      latency={showLatency ? latency : undefined}
    />
  );
};

export interface SearchResultsProps {
  isLoading: boolean;
  matchResults?: MatchResponse;
  error?: Error;
  latency?: number;
}

export const SearchResults = ({ isLoading, matchResults, error, latency }: SearchResultsProps) => {
  if (isLoading) {
    return <Alert mode="loading" title="Loading..." />;
  } else if (matchResults != null) {
    return (
      <div className="space-y-2">
        <p className="text-base text-gray-600">
          <span className="font-bold">{matchResults.results.length}</span> results retrieved from a total of{' '}
          <span className="font-bold">{matchResults.totalIndexCount.toLocaleString('en-US')}</span>{' '}
          {`items${latency ? ` in ${latency.toFixed(0)} ms.` : ''}`}
        </p>
        {/* <SearchResultsTable results={matchResults.results} /> */}
        <SearchResultsGrid results={matchResults.results} />
      </div>
    );
  } else if (error != null) {
    return <Alert mode="info" title="Info" subtitle={(error as Error).message} />;
  } else {
    return <Alert mode="error" title="Unknown error" />;
  }
};
