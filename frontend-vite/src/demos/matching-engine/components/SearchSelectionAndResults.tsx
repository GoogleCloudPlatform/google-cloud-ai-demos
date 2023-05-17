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
import { getSuggestions, SuggestionInfo, SuggestionInfosResponse, SearchServiceInfo } from '../queries';
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

  // The user selected image file.
  const [imageFile, setImageFile] = React.useState<File | string | null>(null);

  // Path to the image file. Used to display the user selected image.
  const [imageFilePath, setImageFilePath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTextFieldText('');
    setSearchQuery('');
    setImageFile(null);
    setImageFilePath(null);
    setSelectedIndex(undefined);
  }, [serviceId]);

  React.useEffect(() => {
    console.log(`setSearchQuery(${debouncedValue});`);
    setSearchQuery(debouncedValue);
    setImageFile(null);
    setImageFilePath(null);
  }, [debouncedValue, setSearchQuery]);

  const renderTextSearch = () => {
    {
      return (
        allowsTextInput && (
          <div className="flex flex-col gap-4 border-l-4 p-4 rounded-md">
            <h3 className="text-3xl">Search by text</h3>
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
          </div>
        )
      );
    }
  };

  const renderImageUpload = () => {
    {
      return (
        allowsImageInput && (
          <div className="flex flex-col gap-4 border-l-4 p-4 rounded-md">
            <h3 className="text-3xl">Search by image</h3>
            <div className="text-center justify-center">
              <div className="flex flex-row gap-8">
                <div className="flex-1 flex-col items-baseline space-y-2">
                  <input
                    key={imageFile?.toString()}
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
                {/* <div className="flex-1 flex-col items-baseline space-y-2">
                  <label className="font-extralight">Paste a link</label>
                  <input
                    type="text"
                    className="w-full input input-bordered max-w-md"
                    placeholder="Type a search query"
                    value={typeof imageFile === 'string' ? imageFile : ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const newText = event.target.value;
                      setImageFile(newText);
                    }}
                  />
                </div> */}
              </div>
              {imageFilePath && (
                <div className="flex flex-col items-center">
                  <img src={imageFilePath} className="border-2 p-8 object-contain h-48" />
                </div>
              )}
            </div>
          </div>
        )
      );
    }
  };

  const handleFileChange = (file: File | string | null) => {
    console.log('handleFileChange');
    if (file != null) {
      setSearchQuery('');
      setImageFile(file);

      if (file instanceof File) {
        // Get the file url and save it to state
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result != null) {
            setImageFilePath(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else if (typeof file === 'string') {
        setImageFile(file);
        setImageFilePath(file);
      }
    } else {
      setImageFile(null);
    }
  };

  const renderRecommendations = () => {
    return (
      <div className="flex flex-col gap-8">
        {renderTextSearch()}
        {renderImageUpload()}
        <div className="mt-4">
          <h6 className="text-sm text-gray-500">Suggestions</h6>
          <div className="flex flex-row gap-4">
            <SuggestionsList
              items={suggestions.slice(0, NUM_ITEMS)}
              selectedIndex={selectedIndex}
              onSelected={(item: SuggestionInfo, index: number) => {
                if (allowsTextInput && item.text) {
                  setTextFieldText(item.text);
                } else if (allowsImageInput && item.image) {
                  setImageFile(item.image);
                } else if (item.text) {
                  setSearchQuery(item.text);
                }

                setSelectedIndex(index);
              }}
            />
            {refetchSuggestions && (
              <Button
                className="btn border-none aspect-square h-16 hover:bg-primt text-white px-4 py-4 flex items-center justify-center"
                onClick={() => {
                  setSelectedIndex(undefined);
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

        {searchQuery && <SearchResultsForTextQuery serviceId={serviceId} searchQuery={searchQuery} />}
        {imageFile && <SearchResultsForImageQuery serviceId={serviceId} image={imageFile} />}
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
        allowsTextInput={matchServiceInfo.allowsTextInput}
        allowsImageInput={matchServiceInfo.allowsImageInput}
        suggestions={suggestionsResponse.items}
        refetchSuggestions={refetchSuggestions}
      />
    );
  } else if (isError && error) {
    return (
      <div className="alert alert-error flex items-center">
        <div className="loader mr-2" />
        <div>
          <h3 className="alert-title">Could not load suggestions</h3>
          {error.message}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
