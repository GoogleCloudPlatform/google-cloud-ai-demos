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

interface SearchResultsTableProps {
  results: SearchResult[];
}

export const SearchResultsTable = ({ results }: SearchResultsTableProps) => {
  return (
    <div className="border-2 border-gray-300 rounded-lg">
      <table className="table w-full">
        <thead className="border-b-2 border-gray-300">
          <tr>
            <th className="text-sm font-medium uppercase">Rank</th>
            <th className="text-sm font-medium uppercase">Item</th>
            <th className="text-sm font-medium uppercase text-right">Distance</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={index}
              className={`border-b-2 border-gray-300 ${index === results.length - 1 ? 'border-none' : ''}`}
            >
              <td className="text-sm font-medium uppercase">{index + 1}</td>
              {result.image ? (
                <td>
                  {(result.url ?? result.image) != null ? (
                    <a href={result.url ?? result.image} target="_blank" rel="noreferrer">
                      <img className="object-cover w-24 h-24 inline-block" src={result.image} alt={result.text} />
                    </a>
                  ) : (
                    <img className="object-cover w-24 h-24 inline-block" src={result.image} alt={result.text} />
                  )}
                </td>
              ) : (
                <td>
                  {result.url != null ? (
                    <a href={result.url} target="_blank" rel="noreferrer" className="text-base">
                      {result.text}
                    </a>
                  ) : (
                    <span className="text-base">{result.text}</span>
                  )}
                </td>
              )}
              <td className="text-right">{result.distance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
