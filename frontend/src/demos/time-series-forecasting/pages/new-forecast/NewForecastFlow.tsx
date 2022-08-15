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

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Breadcrumbs, Container, Stack, Toolbar, Typography } from '@mui/material';
import { DatasetFull, ParameterDict } from 'demos/time-series-forecasting/models';
import DatasetSelection from 'demos/time-series-forecasting/pages/new-forecast/DatasetSelection';
import JobResult from 'demos/time-series-forecasting/pages/new-forecast/ForecastJobResult';
import { ModelSelection, ModelSelectionHandle } from 'demos/time-series-forecasting/pages/new-forecast/ModelSelection';
import { StepWrapper } from 'demos/time-series-forecasting/pages/new-forecast/StepWrapper';
import * as React from 'react';
interface NewForecastStepProps {
  selectedDataset?: DatasetFull;
  selectedModelType?: string;
  selectedModelParameters?: ParameterDict;
  selectedPredictionParameters?: ParameterDict;
  setStatus: (status?: string) => void;
  setSelectedDataset: (dataset: DatasetFull) => void;
  setSelectedModelType: (modelType: string) => void;
  setSelectedModelParameters: (parameters: ParameterDict | undefined) => void;
  setSelectedPredictionParameters: (parameters: ParameterDict | undefined) => void;
  ref: React.RefObject<ModelSelectionHandle>;
}

interface NewForecastStepResponse {
  title: string;
  body: string;
  isBackButtonHidden?: boolean;
  isNextButtonHidden?: boolean;
  isBackButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
  node?: React.ReactNode;
  checkCompletion: () => Promise<boolean | void>; // Return a Promise that signals if the step is complete.
}

type ForecastStep = (props: NewForecastStepProps) => NewForecastStepResponse;

const datasetSelection: ForecastStep = ({
  selectedDataset,
  setSelectedDataset,
}: NewForecastStepProps): NewForecastStepResponse => {
  const isComplete = selectedDataset != null;
  return {
    title: 'Select a dataset',
    body: 'Here are a few time-series datasets to choose from.',
    isBackButtonDisabled: false,
    isNextButtonDisabled: !isComplete,
    node: <DatasetSelection selectedDataset={selectedDataset} onDatasetSelected={setSelectedDataset} />,
    checkCompletion: () => Promise.resolve(isComplete),
  };
};

const modelSelection: ForecastStep = ({
  selectedDataset,
  selectedModelType,
  selectedModelParameters,
  selectedPredictionParameters,
  setSelectedModelType,
  setSelectedModelParameters,
  setSelectedPredictionParameters,
  setStatus,
  ref,
}: NewForecastStepProps): NewForecastStepResponse => {
  if (selectedDataset == null) {
    throw new Error('Dataset not set');
  }

  return {
    title: 'Select a model',
    body: 'Choose from a variety of models.',
    isBackButtonDisabled: false,
    isNextButtonDisabled: selectedModelType == null,
    node: (
      <ModelSelection
        selectedDataset={selectedDataset}
        selectedModelType={selectedModelType}
        selectedModelParameters={
          selectedModelParameters ||
          (selectedModelType != null ? selectedDataset.recommendedModelParameters[selectedModelType] : undefined)
        }
        selectedPredictionParameters={
          selectedPredictionParameters ||
          (selectedModelType != null ? selectedDataset.recommendedPredictionParameters[selectedModelType] : undefined)
        }
        setSelectedModelType={setSelectedModelType}
        setStatus={setStatus}
        ref={ref}
      />
    ),
    checkCompletion: () =>
      ref?.current?.validate().then(
        ([modelParameters, predictionParameters]) => {
          // If valid, update parameters
          setSelectedModelParameters(modelParameters);
          setSelectedPredictionParameters(predictionParameters);
          setStatus();

          return true;
        },
        (error) => {
          const missingParameterNames = Object.keys(error).join(', ');
          setStatus(`Missing: ${missingParameterNames}`);

          return false;
        }
      ) ?? Promise.resolve(true),
  };
};

const jobResults: ForecastStep = ({
  selectedDataset,
  selectedModelType,
  selectedModelParameters,
  selectedPredictionParameters,
}: NewForecastStepProps): NewForecastStepResponse => {
  const isComplete = true;

  if (selectedDataset == null) {
    throw new Error('Dataset not set');
  }

  if (selectedModelType == null) {
    throw new Error('Model type not set');
  }

  if (selectedModelParameters == null) {
    throw new Error('Model parameters not set');
  }

  if (selectedPredictionParameters == null) {
    throw new Error('Prediction parameters not set');
  }

  return {
    title: 'Review forecast',
    body: 'Review the forecast results.',
    isBackButtonHidden: true,
    isBackButtonDisabled: false,
    isNextButtonDisabled: true,
    node: (
      <JobResult
        trainingMethodId={selectedModelType}
        datasetId={selectedDataset.id}
        modelParameters={selectedModelParameters}
        predictionParameters={selectedPredictionParameters}
      />
    ),
    checkCompletion: () => Promise.resolve(isComplete),
  };
};

const stepBreadcrumbs = ['Dataset', 'Model', 'Results'];
const steps = [datasetSelection, modelSelection, jobResults];

interface StepProviderResponse {
  title: string;
  body: string;
  status?: string;
  breadcrumbs: string[];
  currentStepIndex: number;
  onBackButtonTapped: () => void;
  onNextButtonTapped: () => void;
  isBackButtonHidden: boolean;
  isNextButtonHidden: boolean;
  isBackButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
  node: React.ReactNode;
}

const useStepProvider = (): StepProviderResponse => {
  const [status, setStatus] = React.useState<string>();
  const [selectedDataset, setSelectedDataset] = React.useState<null | DatasetFull>(null);

  const [selectedModelType, setSelectedModelType] = React.useState<string>('bqml_arimaplus');
  const [selectedModelParameters, setSelectedModelParameters] = React.useState<ParameterDict | undefined>(undefined);
  const [selectedPredictionParameters, setSelectedPredictionParameters] = React.useState<ParameterDict | undefined>(
    undefined
  );
  const ref = React.useRef<ModelSelectionHandle>(null);

  const [currentStepIndex, setStepIndex] = React.useState<number>(0);

  // Create the current step
  const currentStep = steps[currentStepIndex];
  const {
    title,
    body,
    isBackButtonDisabled,
    isNextButtonDisabled,
    isBackButtonHidden,
    isNextButtonHidden,
    node,
    checkCompletion,
  } = currentStep({
    selectedDataset: selectedDataset ?? undefined,
    selectedModelType,
    selectedModelParameters,
    selectedPredictionParameters,
    setStatus,
    setSelectedDataset,
    setSelectedModelType,
    setSelectedModelParameters,
    setSelectedPredictionParameters,
    ref: ref,
  });

  // Move back one step if possible
  const onBackButtonTapped = (): void => {
    setStepIndex(Math.max(Math.min(currentStepIndex - 1, steps.length - 1), 0));
  };

  // Move forwards one step if possible and if current step is complete
  const onNextButtonTapped = (): void => {
    checkCompletion().then((isComplete) => {
      if (isComplete) {
        setStepIndex(Math.max(Math.min(currentStepIndex + 1, steps.length - 1), 0));
      }
    });
  };

  return {
    title,
    body,
    status,
    breadcrumbs: stepBreadcrumbs,
    currentStepIndex,
    onBackButtonTapped,
    onNextButtonTapped,
    isBackButtonHidden: currentStepIndex <= 0 || (isBackButtonHidden ?? false),
    isNextButtonHidden: currentStepIndex >= steps.length - 1 || (isNextButtonHidden ?? false),
    isBackButtonDisabled,
    isNextButtonDisabled,
    node,
  };
};

export default () => {
  const {
    title,
    body,
    status,
    breadcrumbs,
    currentStepIndex,
    onBackButtonTapped,
    onNextButtonTapped,
    isBackButtonHidden,
    isNextButtonHidden,
    isBackButtonDisabled,
    isNextButtonDisabled,
    node,
  } = useStepProvider();

  const header = (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => {
        if (currentStepIndex == index) {
          return (
            <Typography key={index} variant="subtitle2">
              <b>{breadcrumb.toUpperCase()}</b>
            </Typography>
          );
        } else {
          return (
            <Typography key={index} variant="subtitle2">
              {breadcrumb}
            </Typography>
          );
        }
      })}
    </Breadcrumbs>
  );

  return (
    <Container sx={{ p: '0px' }} maxWidth="lg" disableGutters>
      <Stack direction="column" justifyContent="center">
        <Box sx={{ marginBottom: '12px' }}>
          <Typography variant="h1">Forecasting Web App Demo</Typography>
          <br />
          <Typography variant="body1">
            Follow the instructions below to create a forecast. This demo supports a variety of forecasting methods.
          </Typography>
        </Box>
        <Toolbar component={Box} sx={{ justifyContent: 'space-between', display: 'flex' }} disableGutters>
          <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
            {/* <Button variant="outlined" startIcon={<BackIcon />} href="/demos/forecasting/time-series">
              Home
            </Button> */}
          </Box>
          {header}
          <Box sx={{ flexGrow: 1, flexBasis: 0 }}></Box>
        </Toolbar>
        <StepWrapper
          content={{ title: title, body: body }}
          status={status}
          isBackButtonHidden={isBackButtonHidden}
          isNextButtonHidden={isNextButtonHidden}
          onBackButtonTapped={onBackButtonTapped}
          onNextButtonTapped={onNextButtonTapped}
          isBackButtonDisabled={isBackButtonDisabled}
          isNextButtonDisabled={isNextButtonDisabled}
        >
          {node}
        </StepWrapper>
      </Stack>
    </Container>
  );
};
