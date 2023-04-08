/**
 * Copyright 2023 Google LLC
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
import { SearchResults } from './SearchResults';
import { SelectionList } from './SelectionList';
import { getItems, ItemInfo, ItemInfosResponse, SearchServiceInfo } from '../queries';
import * as React from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'use-debounce';
import Alert from 'common/components/Alert';

interface MatchFlowProps {
  serviceId: string;
  allowsTextInput: boolean;
  items: ItemInfo[];
}

const MatchSelectionAndResults = ({ serviceId, allowsTextInput, items }: MatchFlowProps) => {
  const [textFieldText, setTextFieldText] = React.useState<string>('');
  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedValue] = useDebounce(textFieldText, 500);

  React.useEffect(() => {
    setTextFieldText('');
    setSearchQuery('');
    setSelectedIndex(undefined);
  }, [serviceId]);

  React.useEffect(() => {
    console.log(`setSearchQuery(${debouncedValue});`);
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div>
          <h3 className="text-3xl">Search for an item</h3>
          {allowsTextInput ? (
            <input
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="Search"
              value={textFieldText}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const newText = event.target.value;
                setTextFieldText(newText);
              }}
            />
          ) : null}
          <div className="mt-2">
            <h6 className="text-sm text-gray-500">Suggestions</h6>
            <SelectionList
              items={items}
              selectedIndex={selectedIndex}
              onSelected={(item: ItemInfo, index: number) => {
                if (item.text != null) {
                  if (allowsTextInput) {
                    setTextFieldText(item.text);
                  } else {
                    setSearchQuery(item.text);
                  }
                }

                setSelectedIndex(index);
              }}
            />
          </div>
        </div>
        <div>
          <h6 className="text-xl">Search results</h6>
          <br />
          <SearchResults serviceId={serviceId} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default ({ matchServiceInfo }: { matchServiceInfo: SearchServiceInfo }) => {
  const {
    isLoading,
    error,
    data: itemsResponse,
    isError,
  } = useQuery<ItemInfosResponse, Error>(
    ['getItems', matchServiceInfo.id],
    () => {
      return getItems(matchServiceInfo.id);
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <Alert mode="loading" title="Loading..." />;
  } else if (itemsResponse != null && itemsResponse.items != null) {
    return (
      <MatchSelectionAndResults
        serviceId={matchServiceInfo.id}
        allowsTextInput={matchServiceInfo.allowsTextInput}
        items={itemsResponse.items}
      />
    );
  } else if (isError && error) {
    return (
      <div className="alert alert-error flex items-center">
        <div className="loader mr-2" />
        <div>
          <h3 className="alert-title">Could not load images</h3>
          {error.message}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
