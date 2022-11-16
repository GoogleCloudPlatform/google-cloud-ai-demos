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

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomSelect from 'common/components/inputs/CustomSelect';
import CustomSlider from 'common/components/inputs/CustomSlider';
import { MoreInfoCard, MoreInfoCardProps } from 'common/components/MoreInfoCard';
import { ParameterDict } from 'demos/time-series-forecasting/models';
import { DatasetFull } from 'demos/time-series-forecasting/models';
import {
  ModelSelectionHandle,
  ModelSelectionProps,
} from 'demos/time-series-forecasting/pages/new-forecast/ModelSelection';
import React from 'react';
import { Control, FieldErrorsImpl, useForm } from 'react-hook-form';
import * as Yup from 'yup';

const moreInfoCardProps: MoreInfoCardProps = {
  title: 'More info',
  // subtitle: 'Learn more about BigQuery ML',
  rows: [
    {
      text: 'Forecasting Overview',
      link: 'https://cloud.google.com/vertex-ai/docs/tabular-data/forecasting/overview',
    },
    {
      text: 'Vertex AI Forecasting Jupyter Notebooks',
      link: 'https://cloud.google.com/vertex-ai/docs/tabular-data/forecasting/tutorials-samples',
    },
  ],
};

interface ModelFormValues extends ParameterDict {
  targetColumn: string;
  timeColumn: string;
  timeSeriesIdentifierColumn: string;
  dataGranularityUnit: string; // Accepted values are ``minute``, ``hour``, ``day``, ``week``, ``month``, ``year``.
  dataGranularityCount: number;
}

const modelValidationSchema = Yup.object().shape({
  targetColumn: Yup.string().required('This is required'),
  timeColumn: Yup.string().required('This is required'),
  timeSeriesIdentifierColumn: Yup.string().required('This is required'),
  dataGranularityUnit: Yup.string().required('This is required'),
  dataGranularityCount: Yup.number().required('This is required'),
});

interface ModelParametersFormProps {
  control: Control<ModelFormValues>;
  errors: FieldErrorsImpl<{
    targetColumn: string;
    timeColumn: string;
    timeSeriesIdentifierColumn: string;
    dataGranularityUnit: string;
    dataGranularityCount: number;
  }>;
  selectedDataset: DatasetFull;
}

const ModelParametersForm = ({ control, errors, selectedDataset }: ModelParametersFormProps) => {
  return (
    <Grid container spacing={8}>
      <Grid xs={12} lg={6}>
        <CustomSelect
          description="Name of the column that the Model is to predict values for."
          name="targetColumn"
          label="Target column"
          isOptional={false}
          control={control}
          errorMessage={errors.targetColumn?.message}
          options={selectedDataset.columns}
        />
      </Grid>
      <Grid xs={12} lg={6}>
        <CustomSelect
          description="Name of the column that identifies time order in the time series."
          name="timeColumn"
          label="Time column"
          isOptional={false}
          control={control}
          errorMessage={errors.timeColumn?.message}
          options={selectedDataset.columns}
        />
      </Grid>
      <Grid xs={12} lg={6}>
        <CustomSelect
          description="Name of the column that identifies the time series."
          name="timeSeriesIdentifierColumn"
          label="Time-series identifier column"
          isOptional={false}
          control={control}
          errorMessage={errors.timeSeriesIdentifierColumn?.message}
          options={selectedDataset.columns}
        />
      </Grid>
      <Grid xs={12} lg={6}>
        <CustomSelect
          description="The data granularity unit, representing the time interval between the training data rows."
          name="dataGranularityUnit"
          label="Data granularity unit"
          isOptional={false}
          control={control}
          errorMessage={errors.dataGranularityUnit?.message}
          options={['minute', 'hour', 'day', 'week', 'month', 'year']}
        />
      </Grid>
      <Grid xs={12} lg={6}>
        <CustomSlider
          step={1}
          minValue={0}
          maxValue={10}
          description="The number of data granularity units between data points in the training
          data. If 'data granularity unit' is `minute`, can be 1, 5, 10, 15, or 30. For all other
          values of 'data granularity unit', this must be 1."
          name="dataGranularityCount"
          label="Data granularity count"
          control={control}
          errorMessage={errors.dataGranularityCount?.message}
        />
      </Grid>
    </Grid>
  );
};

interface PredictionFormValues extends ParameterDict {
  forecastHorizon: number;
  contextWindow: number;
}

const predictionValidationSchema = Yup.object().shape({
  forecastHorizon: Yup.number().required('This is required'),
  contextWindow: Yup.number().required('This is required'),
});

interface PredictionParametersFormProps {
  control: Control<PredictionFormValues>;
  errors: FieldErrorsImpl<{
    forecastHorizon: number;
    contextWindow: number;
  }>;
  selectedDataset: DatasetFull;
}

const PredictionParametersForm = ({ control, errors }: PredictionParametersFormProps) => {
  return (
    <Grid container spacing={8}>
      <Grid xs={12} lg={6}>
        <CustomSlider
          step={1}
          minValue={0}
          maxValue={30}
          description="The amount of time into the future for which forecasted values for the target are
          returned. Expressed in number of units defined by the 'data granularity unit' and
          'data granularity count' field"
          name="forecastHorizon"
          control={control}
          label="Forecast horizon"
          errorMessage={errors.forecastHorizon?.message}
        />
      </Grid>
      <Grid xs={12} lg={6}>
        <CustomSlider
          step={1}
          minValue={0}
          maxValue={30}
          description="The amount of time into the past training and prediction data is used for model training and prediction respectively. Expressed in number of units defined by the `data_granularity` field."
          name="contextWindow"
          control={control}
          label="Context window"
          errorMessage={errors.contextWindow?.message}
        />
      </Grid>
    </Grid>
  );
};

export default React.forwardRef(
  (
    {
      selectedDataset,
      selectedModelParameters,
      selectedPredictionParameters,
    }: Pick<ModelSelectionProps, 'selectedDataset' | 'selectedModelParameters' | 'selectedPredictionParameters'>,
    ref: React.Ref<ModelSelectionHandle>
  ) => {
    const {
      control: controlModel,
      getValues: getValuesModel,
      handleSubmit: handleSubmitModel,
      formState: { errors: errorsModel },
    } = useForm<ModelFormValues>({
      resolver: yupResolver(modelValidationSchema),
      defaultValues: selectedModelParameters ?? {
        targetColumn: '',
        timeColumn: '',
        timeSeriesIdentifierColumn: '',
        dataGranularityUnit: 'day',
        dataGranularityCount: 1,
      },
    });

    const {
      control: controlPrediction,
      getValues: getValuesPrediction,
      handleSubmit: handleSubmitPrediction,
      formState: { errors: errorsPrediction },
    } = useForm<PredictionFormValues>({
      resolver: yupResolver(predictionValidationSchema),
      defaultValues: selectedPredictionParameters ?? {
        forecastHorizon: 10,
      },
    });

    // This handle conforms to ModelValidationHandle and return true on successful validation and false otherwise.
    React.useImperativeHandle(ref, () => ({
      validate: () =>
        Promise.all([
          handleSubmitModel(
            () => null,
            (error) => {
              throw error;
            }
          )(),
          handleSubmitPrediction(
            () => null,
            (error) => {
              throw error;
            }
          )(),
        ]).then(
          () => {
            return [getValuesModel() as ParameterDict, getValuesPrediction() as ParameterDict];
          },
          (error) => {
            throw error;
          }
        ),
    }));

    return (
      <Stack spacing={3}>
        <Typography variant="body1">
          Vertex AI Forecast can ingest datasets of up to 100 million rows covering years of historical data for many
          thousands of product lines from BigQuery or CSV files. The powerful modeling engine would automatically
          process the data and evaluate hundreds of different model architectures and package the best ones into one
          model which is easy to manage, even without advanced data science expertise.
        </Typography>
        <MoreInfoCard {...moreInfoCardProps} />
        <Box>
          <ModelParametersForm control={controlModel} errors={errorsModel} selectedDataset={selectedDataset} />
          <PredictionParametersForm
            control={controlPrediction}
            errors={errorsPrediction}
            selectedDataset={selectedDataset}
          />
        </Box>
      </Stack>
    );
  }
);
