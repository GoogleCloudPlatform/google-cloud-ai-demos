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
import * as React from 'react';
import { useQuery } from 'react-query';
import { getMatchServiceInfo, SearchServiceInfo } from '../queries';

import Alert from 'common/components/Alert';
import SearchSelectionAndResults from '../components/SearchSelectionAndResults';

export default () => {
  const {
    isLoading,
    error,
    data: matchServiceInfos,
    isError,
  } = useQuery<SearchServiceInfo[], Error>(
    ['getMatchServiceInfo'],
    () => {
      return getMatchServiceInfo();
    },
    { refetchOnWindowFocus: false }
  );

  const [selectedTabIndex, setTab] = React.useState<number>(0);
  const handleChange = (newTab: number) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  const selectedServiceInfo =
    matchServiceInfos != null && matchServiceInfos.length > 0 ? matchServiceInfos[selectedTabIndex] : null;

  if (isLoading) {
    return <Alert mode="info" title="Loading..." className="w-fit" />;
  } else if (matchServiceInfos != null && selectedServiceInfo != null) {
    return (
      <div className="flex flex-col gap-2 p-8">
        <div className="self-center">
          <div className="btn-group">
            {matchServiceInfos.map((matchServiceInfo, index) => (
              <button
                key={index}
                className={`btn ${selectedTabIndex === index ? 'btn-primary' : ''}`}
                onClick={() => handleChange(index)}
              >
                {matchServiceInfo.name}
              </button>
            ))}
          </div>
        </div>
        <div className="text-center text-2lx py-4">{selectedServiceInfo.description}</div>
        {selectedServiceInfo.code != null ? (
          <div className="self-center">
            <Alert mode="info">
              See code at{' '}
              <a className="link" href={selectedServiceInfo.code.url} target="_blank" rel="noreferrer">
                {selectedServiceInfo.code.title}
              </a>
            </Alert>
          </div>
        ) : null}
        <SearchSelectionAndResults matchServiceInfo={matchServiceInfos[selectedTabIndex]} />
      </div>
    );
  } else if (isError && error) {
    return <Alert mode="error" title="Could not load match service info" subtitle={error.message} />;
  } else {
    return null;
  }
};
