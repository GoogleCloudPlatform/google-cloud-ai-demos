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

import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid } from '@mui/x-data-grid';
import dataset from 'demos/time-series-forecasting/pages/explanations/sample-data/retailDatasetFull.json';
import * as React from 'react';

export const DatasetStep = () => {
  return (
    <Grid container spacing={4} padding={0}>
      <Grid xs={12}>
        <Typography variant="body1">
          To create your sales prediction, you first need to get historical data about the sales for each product at
          each store. You might store this as CSV files or in a database like BigQuery, which is purpose-built for data
          analytics. For demonstration purposes, we will use the sample dataset below.
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Typography variant="h6">Sample data</Typography>
        <Typography variant="body2">
          This sample dataset is synthetically generated to mimic the sales of a fictional outdoor goods store. It has
          multiple stores. Each row of data corresponds to the number of sales for a particular product at a particular
          store for a given date.
          {dataset.description}
        </Typography>
        <br />
        <Typography variant="overline">Sample data</Typography>
        <Box sx={{ height: 360, width: '100%' }}>
          <DataGrid
            rows={dataset.dfPreview}
            columns={dataset.columns.map((column: string) => {
              return { field: column, editable: false, flex: 1 };
            })}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            pagination
            hideFooter={true}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
