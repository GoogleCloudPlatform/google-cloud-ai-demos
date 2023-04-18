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
import { SearchResultsForTextQuery, SearchResultsForImageQuery } from './SearchResults';
import { SuggestionsList } from './SuggestionsList';
import {
  getSuggestions,
  SuggestionInfo,
  SuggestionInfosResponse,
  SearchServiceInfo,
  MatchResponse,
  matchByImage,
} from '../queries';
import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDebounce } from 'use-debounce';
import Alert from 'common/components/Alert';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@mui/material';

interface MatchFlowProps {
  serviceId: string;
  allowsTextInput: boolean;
  allowsImageInput: boolean;
  suggestions: SuggestionInfo[];
  refetchSuggestions?: () => void;
}

const NUM_ITEMS = 3;

const MatchSelectionAndResults = ({
  serviceId,
  allowsTextInput,
  allowsImageInput,
  suggestions,
  refetchSuggestions,
}: MatchFlowProps) => {
  const [textFieldText, setTextFieldText] = React.useState<string>('');
  const [selectedIndex, setSelectedIndex] = React.useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedValue] = useDebounce(textFieldText, 500);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    setTextFieldText('');
    setSearchQuery('');
    setSelectedIndex(undefined);
  }, [serviceId]);

  React.useEffect(() => {
    console.log(`setSearchQuery(${debouncedValue});`);
    setSearchQuery(debouncedValue);
  }, [debouncedValue, setSearchQuery]);

  // const annotateImageByFileMutation = useMutation<MatchResponse, Error, File>((file: File) => {
  //   return matchByImage(, file);
  // });

  const renderTextSearch = () => {
    {
      return allowsTextInput ? (
        <input
          type="text"
          className="input input-bordered w-full mt-2 text-2xl px-4 py-8"
          placeholder="Type a search query"
          value={textFieldText}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newText = event.target.value;
            setTextFieldText(newText);
          }}
        />
      ) : null;
    }
  };
  const renderImageUpload = () => {
    {
      return allowsImageInput ? (
        <div className="flex flex-col items-start">
          <div className="flex-1 flex-col items-baseline space-y-2">
            <label className="font-extralight">Choose a file</label>
            <input
              type="file"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const files = event.target.files;
                if (files && files.length > 0) {
                  handleFileChange(files[0]);
                }
              }}
              className="w-full file-input input-bordered max-w-md"
            />
          </div>
        </div>
      ) : null;
    }
  };

  const handleFileChange = (file: File | null) => {
    console.log('handleFileChange');
    if (file != null) {
      setImageFile(file);

      // // Reset upload results
      // annotateImageByFileMutation.reset();

      // // Get the file url and save it to state
      // const reader = new FileReader();
      // reader.onload = (event) => {
      //   if (event.target?.result != null) {
      //     setSelectedFileURL(event.target.result as string);
      //   }
      // };
      // reader.readAsDataURL(file);

      // annotateImageByFileMutation.mutate(file);
    } else {
      setImageFile(null);
    }
  };

  const renderRecommendations = () => {
    return (
      <div>
        <h3 className="text-3xl">Search for an item</h3>
        {renderTextSearch()}
        {renderImageUpload()}
        <div className="mt-4">
          <h6 className="text-sm text-gray-500">Suggestions</h6>
          <div className="flex flex-row gap-4">
            <SuggestionsList
              items={suggestions.slice(0, NUM_ITEMS)}
              selectedIndex={selectedIndex}
              onSelected={(item: SuggestionInfo, index: number) => {
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
            {refetchSuggestions && (
              <Button
                className="btn border-none aspect-square h-16 hover:bg-primt text-white px-4 py-4 flex items-center justify-center"
                onClick={() => {
                  refetchSuggestions();
                }}
              >
                <ArrowPathIcon className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    return (
      <div className="flex flex-col gap-2">
        <h6 className="text-xl">Search results</h6>
        {/* <SearchResultsForTextQuery serviceId={serviceId} searchQuery={searchQuery} /> */}
        <SearchResultsForImageQuery serviceId={serviceId} image={imageFile ?? undefined} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {renderRecommendations()}
      {renderSearchResults()}
    </div>
  );
};

export default ({ matchServiceInfo }: { matchServiceInfo: SearchServiceInfo }) => {
  const {
    isLoading,
    error,
    data: suggestionsResponse,
    isError,
    refetch: refetchSuggestions,
  } = useQuery<SuggestionInfosResponse, Error>(
    ['getItems', matchServiceInfo.id],
    () => {
      return getSuggestions(matchServiceInfo.id);
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return <Alert mode="loading" title="Loading..." />;
  } else if (suggestionsResponse != null && suggestionsResponse.items != null) {
    return (
      <MatchSelectionAndResults
        serviceId={matchServiceInfo.id}
        allowsTextInput={true}
        allowsImageInput={true}
        suggestions={suggestionsResponse.items}
        refetchSuggestions={refetchSuggestions}
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
