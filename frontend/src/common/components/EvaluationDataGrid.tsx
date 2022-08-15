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

import { Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridData } from 'demos/time-series-forecasting/models';
import { fetchEvaluation } from 'demos/time-series-forecasting/queries/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

interface EvaluationDataGridProps {
  jobId: string;
}
export default ({ jobId }: EvaluationDataGridProps) => {
  const { isLoading, error, data, isError } = useQuery<DataGridData, Error>(['evaluation', jobId], () => {
    return fetchEvaluation(jobId);
  });

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (data != null) {
    return (
      <div style={{ height: 'auto', overflow: 'auto' }}>
        <DataGrid
          rows={data.rows}
          columns={data.columns.map((column: string) => {
            return { field: column, editable: false, flex: 1 };
          })}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          pagination
          hideFooter={false}
          autoHeight={true}
        />
      </div>
    );
  } else if (isError && error != null) {
    return <Alert severity="error">{error.message}</Alert>;
  } else {
    return <Alert severity="info">No data found</Alert>;
  }
};
