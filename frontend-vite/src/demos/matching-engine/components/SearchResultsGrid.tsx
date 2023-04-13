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
import { SearchResult } from '../queries';
import * as React from 'react';
import clsx from 'clsx';

interface ImageSelectionButtonProps {
  item: SearchResult;
  onSelected?: (result: SearchResult) => void;
}

export const ImageSelectionButton = ({ item, onSelected }: ImageSelectionButtonProps) => {
  return (
    <button
      className="relative w-full h-full justify-end overflow-hidden bg-gray-300 "
      onClick={() => {
        if (onSelected != null) {
          onSelected(item);
        }
      }}
    >
      <div className="flex flex-col p-4 w-full h-full gap-4">
        {item.image && (
          <img src={item.image} alt={item.title} className="inset-0 h-48 object-cover object-center w-full" />
        )}
        <div className="text-left font-medium">{item.title}</div>
      </div>
    </button>
  );
};

interface Props {
  results: SearchResult[];
}

export default ({ results }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full mt-0 gap-2">
      {results.map((item, index) => (
        <div className="aspect-w-1 aspect-h-1" key={index}>
          <ImageSelectionButton item={item} onSelected={(result) => window.open(result.url, '_blank')} />
        </div>
      ))}
    </div>
  );
};
