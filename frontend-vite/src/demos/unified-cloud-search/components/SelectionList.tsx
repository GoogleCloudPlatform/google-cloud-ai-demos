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
import clsx from 'clsx';

interface ImageSelectionButtonProps {
  item: SuggestionInfo;
  isSelected: boolean;
  onSelected?: () => void;
}

export const ImageSelectionButton = ({ item, isSelected, onSelected }: ImageSelectionButtonProps) => {
  return (
    <button
      className={`relative h-48 w-full focus:z-10 ${isSelected ? 'bg-neutral-400' : 'bg-neutral-300'}`}
      onClick={() => {
        if (onSelected != null) {
          onSelected();
        }
      }}
    >
      <span
        className={`absolute inset-0 bg-center bg-cover`}
        style={{
          backgroundImage: item.img != null ? `url(${item.img})` : undefined,
        }}
      ></span>
      <span className={`absolute inset-0 flex items-center justify-center  ${isSelected ? 'font-bold' : ''}`}>
        <span className={clsx('relative p-4 pt-2 pb-2 text-neutral-700', { link: isSelected })}>{item.text}</span>
      </span>
    </button>
  );
};

interface SelectionListProps {
  items: SuggestionInfo[];
  selectedIndex?: number;
  onSelected?: (item: SuggestionInfo, index: number) => void;
}

export const SelectionList = ({ items, selectedIndex, onSelected }: SelectionListProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-full max-h-[800px] mt-0">
      {items.map((item, index) => (
        <div key={index}>
          <ImageSelectionButton
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
