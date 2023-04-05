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

import { RechartsPredictionAPIResponse } from 'demos/time-series-forecasting/models';
import { DateTime } from 'luxon';
import * as React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const colors: string[] = [
  '#8dd3c7',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
];

const dateFormatter = (date: string) => {
  return DateTime.fromISO(date).toFormat('MMM dd, yyyy');
};

export default ({ groups, data, historyMaxDate }: RechartsPredictionAPIResponse) => {
  return (
    <ResponsiveContainer width="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={dateFormatter} />
        <YAxis />
        {/* <Tooltip /> */}
        <Legend />
        {groups.map((group, index) => (
          <Line
            key={group}
            type="monotone"
            dataKey={group}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
            dot={false}
          />
        ))}
        {historyMaxDate !== null ? (
          <>
            {/* <ReferenceLine x={predictionsMinDate} /> */}
            <ReferenceArea x2={historyMaxDate} fill="grey" fillOpacity={0.3} alwaysShow={true} />
          </>
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
};
