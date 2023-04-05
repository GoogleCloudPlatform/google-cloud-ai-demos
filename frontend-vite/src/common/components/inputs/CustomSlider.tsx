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

import { FormControl, FormHelperText, Input, Slider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface CustomSliderProps<T extends FieldValues> extends UseControllerProps<T> {
  step: number;
  minValue: number;
  maxValue: number;
  description: string;
  label: string;
  errorMessage?: string;
}

const CustomSlider = <T extends FieldValues>({
  name,
  step,
  minValue,
  maxValue,
  description,
  label,
  errorMessage,
  control,
}: CustomSliderProps<T>) => {
  return (
    <CustomCard sx={{ p: '36px' }}>
      <Grid container xs={12} spacing={1}>
        <Grid xs={12} sm={12} md={6}>
          <Typography variant="body1">{label}</Typography>
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <FormControl sx={{ width: '100%' }}>
            <Stack direction="column" spacing={2}>
              {/* <InputLabel>{label}</InputLabel> */}
              {/* <Typography gutterBottom>{label}</Typography> */}
              <Controller
                name={name}
                control={control}
                // defaultValue={minValue}
                render={({ field: { onChange, value } }) => (
                  <Stack direction="row" spacing={3}>
                    <Slider
                      onChange={onChange}
                      valueLabelDisplay="off"
                      value={value}
                      min={minValue}
                      max={maxValue}
                      step={step}
                      marks
                    />
                    <Input value={value} size="small" onChange={onChange} sx={{ width: '36px' }} />
                  </Stack>
                )}
              />

              <FormHelperText>{description}</FormHelperText>
            </Stack>
          </FormControl>
        </Grid>
        <Typography variant="inherit" color="textSecondary">
          {errorMessage}
        </Typography>
      </Grid>
    </CustomCard>
  );
};

export default CustomSlider;
