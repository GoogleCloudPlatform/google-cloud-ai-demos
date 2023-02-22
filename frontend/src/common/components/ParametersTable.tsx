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

import { Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ParameterDict } from 'demos/time-series-forecasting/models';
import * as React from 'react';

interface ParametersTableProps {
  parameters: ParameterDict;
}

export default ({ parameters }: ParametersTableProps) => {
  const entries = Object.entries(parameters);
  if (entries.length > 0) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key="name">Name</TableCell>
              <TableCell key="value" align="right">
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell align="right">{value as string}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return <Alert severity="info">No parameters specified.</Alert>;
  }
};
