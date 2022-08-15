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

import { Alert, Button, CardContent, CircularProgress, Icon, List, ListItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import CustomCard from 'common/components/CustomCard';
import { DatasetFull } from 'demos/time-series-forecasting/models';
import { fetchDatasets } from 'demos/time-series-forecasting/queries/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

interface DatasetCardProps {
  dataset: DatasetFull;
  isSelected: boolean;
  onDatasetSelected: (dataset: DatasetFull) => void;
}

const DatasetCard = ({ isSelected, dataset, onDatasetSelected }: DatasetCardProps) => {
  const theme = useTheme();

  return (
    <CustomCard
      key={dataset.id}
      sx={{
        height: 'auto',
        outline: isSelected ? `2px solid ${theme.palette.primary.main}` : null,
        width: '100%',
      }}
      avatar={<Icon>{dataset.icon}</Icon>}
      title={dataset.displayName}
      subheader={`${dataset.startDate} - ${dataset.endDate}`}
      action={
        <Button
          size="small"
          color="primary"
          onClick={() => {
            onDatasetSelected(dataset);
          }}
          disabled={isSelected}
          variant="outlined"
        >
          Select
        </Button>
      }
    >
      <CardContent sx={{ height: 360 }}>
        <Typography variant="body1">{dataset.description}</Typography>
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
      </CardContent>
    </CustomCard>
  );
};

interface DatasetsProps {
  selectedDataset?: DatasetFull;
  onDatasetSelected: (dataset: DatasetFull) => void;
}

export default ({ selectedDataset, onDatasetSelected }: DatasetsProps) => {
  const { isLoading, data } = useQuery([], fetchDatasets);

  if (isLoading)
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );

  return (
    <List
      sx={{
        height: '100%',
        overflow: 'auto',
      }}
      disablePadding
    >
      {data
        ? data.map((dataset: DatasetFull) => (
            <ListItem key={dataset.id} disablePadding sx={{ marginBottom: '24px', p: '4px' }}>
              <DatasetCard
                dataset={dataset}
                isSelected={selectedDataset != null ? dataset.id == selectedDataset.id : false}
                onDatasetSelected={onDatasetSelected}
              />
            </ListItem>
          ))
        : null}
    </List>
  );
};
