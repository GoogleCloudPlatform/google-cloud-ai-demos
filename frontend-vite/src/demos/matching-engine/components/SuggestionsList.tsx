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

import { SuggestionInfo } from '../queries';
import * as React from 'react';
import clsx from 'clsx';

interface ImageSelectionButtonProps {
  item: SuggestionInfo;
  isSelected: boolean;
  onSelected?: () => void;
}

export const SuggestionButton = ({ item, isSelected, onSelected }: ImageSelectionButtonProps) => {
  return (
    <button
      className={`relative h-24 w-full focus:z-10 ${isSelected ? 'bg-neutral-400' : 'bg-neutral-300'}`}
      onClick={() => {
        if (onSelected != null) {
          onSelected();
        }
      }}
    >
      <span
        className={clsx('absolute inset-0 bg-center bg-cover')}
        style={{
          backgroundImage: item.image != null ? `url(${item.image})` : undefined,
        }}
      ></span>
      <span className={`absolute inset-0 flex items-center justify-center  ${isSelected ? 'font-bold' : ''}`}>
        <span className={clsx('relative p-4 pt-2 pb-2 text-neutral-700', { link: isSelected })}>{item.text}</span>
      </span>
    </button>
  );
};

interface Props {
  items: SuggestionInfo[];
  selectedIndex?: number;
  onSelected?: (item: SuggestionInfo, index: number) => void;
}

export const SuggestionsList = ({ items, selectedIndex, onSelected }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-full mt-0">
      {items.map((item, index) => (
        <div key={index}>
          <SuggestionButton
            item={item}
            isSelected={selectedIndex === index}
            onSelected={() => {
              if (onSelected != null) {
                onSelected(item, index);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};
