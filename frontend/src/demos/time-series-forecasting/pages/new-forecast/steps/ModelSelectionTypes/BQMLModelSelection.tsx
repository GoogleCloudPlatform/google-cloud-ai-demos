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
      text: 'BigQuery for Machine Learning',
      link: 'https://www.cloudskillsboost.google/quests/71',
    },
    {
      text: 'Predict Taxi Fare with a BigQuery ML Forecasting Model',
      link: 'https://www.cloudskillsboost.google/focuses/1797?parent=catalog',
    },
    {
      text: 'The CREATE MODEL statement for time series models',
      link: 'https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-create-time-series',
    },
    {
      text: 'Forecasting with ARIMA+ (Jupyter notebook)',
      link: 'https://cloud.google.com/vertex-ai/docs/tabular-data/forecasting-arima/overview',
    },
  ],
};

interface ModelFormValues extends ParameterDict {
  targetColumn: string;
  timeColumn: string;
  timeSeriesIdentifierColumn: string;
  dataFrequency: string; // Accepted values are 'AUTO_FREQUENCY' | 'PER_MINUTE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'.
}

const modelValidationSchema = Yup.object().shape({
  targetColumn: Yup.string().required('This is required'),
  timeColumn: Yup.string().required('This is required'),
  timeSeriesIdentifierColumn: Yup.string().required('This is required'),
  dataFrequency: Yup.string().required('This is required'),
});

interface ModelParametersFormProps {
  control: Control<ModelFormValues>;
  errors: FieldErrorsImpl<{
    targetColumn: string;
    timeColumn: string;
    timeSeriesIdentifierColumn: string;
    dataFrequency: string;
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
          description="The data frequency of the input time series. The finest supported granularity is 'PER_MINUTE'. When forecasting multiple time-series at once, this argument applies to all individual time series."
          name="dataFrequency"
          label="Data frequency"
          isOptional={false}
          control={control}
          errorMessage={errors.dataFrequency?.message}
          options={['auto_frequency', 'per_minute', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly']}
        />
      </Grid>
    </Grid>
  );
};
interface PredictionFormValues extends ParameterDict {
  forecastHorizon: number;
}

const predictionValidationSchema = Yup.object().shape({
  forecastHorizon: Yup.number().required('This is required'),
});

interface PredictionParametersFormProps {
  control: Control<PredictionFormValues>;
  errors: FieldErrorsImpl<{
    forecastHorizon: number;
  }>;
  selectedDataset: DatasetFull;
}

const PredictionParametersForm = ({ control, errors }: PredictionParametersFormProps) => {
  return (
    <Grid container spacing={8}>
      <Grid xs={12} lg={6}>
        <CustomSlider
          step={30}
          minValue={0}
          maxValue={365}
          description="The number of time points to forecast. When forecasting multiple time-series at once, this parameter applies to each time series."
          name="forecastHorizon"
          control={control}
          label="Forecast horizon"
          errorMessage={errors.forecastHorizon?.message}
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
        dataFrequency: 'daily',
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

    // const onSubmit = handleSubmit((data) => console.log(data));

    return (
      <Stack spacing={3}>
        <Typography variant="body1">
          The multivariate Vertex AI Forecasting model has the potential to model the data more effectively than the
          univariate BigQuery ML ARIMA_PLUS model because it can explicitly model covariates. For an inventory planning
          application, example covariates could be details about product advertisements, product attributes, holidays,
          and locations. In general, it takes less time to train the BigQuery ML ARIMA_PLUS model than the Vertex AI
          Forecasting model. Training a BigQuery ML ARIMA_PLUS model is a good idea if you need to perform many quick
          iterations of model training or if you need an inexpensive baseline to measure other models against.
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
