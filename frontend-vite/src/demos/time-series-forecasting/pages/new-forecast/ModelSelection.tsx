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

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { ParameterDict } from 'demos/time-series-forecasting/models';
import { DatasetFull } from 'demos/time-series-forecasting/models';
import BQMLModelSelection from 'demos/time-series-forecasting/pages/new-forecast/steps/ModelSelectionTypes/BQMLModelSelection';
import VertexAIForecastingModelSelection from 'demos/time-series-forecasting/pages/new-forecast/steps/ModelSelectionTypes/VertexAIModelSelection';
import * as React from 'react';

export type ModelSelectionHandle = {
  validate: () => Promise<[ParameterDict, ParameterDict]>;
};

export interface ModelSelectionProps {
  selectedDataset: DatasetFull;
  selectedModelType?: string;
  isNextButtonDisabled: boolean;
  selectedModelParameters?: ParameterDict;
  selectedPredictionParameters?: ParameterDict;
  setSelectedModelType: (model: string) => void;
  setStatus: (status?: string) => void;
}

export const ModelSelection = React.forwardRef(
  (
    {
      setSelectedModelType,
      selectedDataset,
      selectedModelType,
      selectedModelParameters,
      selectedPredictionParameters,
      setStatus,
    }: Pick<
      ModelSelectionProps,
      | 'setSelectedModelType'
      | 'selectedDataset'
      | 'selectedModelType'
      | 'selectedModelParameters'
      | 'selectedPredictionParameters'
      | 'setStatus'
    >,
    ref: React.Ref<ModelSelectionHandle>
  ) => {
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setStatus(undefined);
      setSelectedModelType(newValue);
    };

    return (
      <Box
        sx={{
          height: '100%',
        }}
      >
        {/* <Typography variant="h6">Choosing a model</Typography>
        <Typography variant="body1">
          Here are some considerations when choosing between BigQueryML ARIMA_PLUS and Vertex AI AutoML Forecasting
        </Typography> */}
        <TabContext value={selectedModelType ?? 'bqml_arimaplus'}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              <Tab value="bqml_arimaplus" label="BQML ARIMA+" />
              <Tab value="vertexai" label="Coming soon: Vertex AI Forecasting" />
              {/* <Tab value="prophet" label="Facebook Prophet" /> */}
            </TabList>
          </Box>
          <TabPanel value="bqml_arimaplus">
            <BQMLModelSelection
              selectedDataset={selectedDataset}
              selectedModelParameters={selectedModelParameters}
              selectedPredictionParameters={selectedPredictionParameters}
              ref={ref}
            />
          </TabPanel>
          <TabPanel value="vertexai">
            <VertexAIForecastingModelSelection
              selectedDataset={selectedDataset}
              selectedModelParameters={selectedModelParameters}
              selectedPredictionParameters={selectedPredictionParameters}
              ref={ref}
            />
          </TabPanel>
        </TabContext>
      </Box>
    );
  }
);
