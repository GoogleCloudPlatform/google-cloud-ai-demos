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
    <div className="flex flex-col gap-4">
      <button
        className={`relative h-48 w-full focus:z-10 bg-neutral-300`}
        onClick={() => {
          if (onSelected != null) {
            onSelected(item);
          }
        }}
      >
        <span
          className={`absolute inset-0 bg-center bg-cover`}
          style={{
            backgroundImage: item.image != null ? `url(${item.image})` : undefined,
          }}
        ></span>
      </button>
      <div>{item.title}</div>
    </div>
  );
};

interface Props {
  results: SearchResult[];
}

export default ({ results }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-h-[800px] mt-0">
      {results.map((item, index) => (
        <div className="bg-white border-neutral-200 border-2 p-4" key={index}>
          <ImageSelectionButton item={item} onSelected={(result) => window.open(result.url, '_blank')} />
        </div>
      ))}
    </div>
  );
};
