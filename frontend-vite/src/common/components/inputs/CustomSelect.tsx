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

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import React from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface CustomSelectProps<T extends FieldValues> extends UseControllerProps<T> {
  options: Array<string | number>;
  description: string;
  label: string;
  isOptional: boolean;
  errorMessage?: string;
}

const CustomSelect = <T extends FieldValues>({
  name,
  options,
  description,
  label,
  isOptional,
  errorMessage,
  control,
}: CustomSelectProps<T>) => {
  return (
    <CustomCard sx={{ p: '36px' }}>
      <Grid container xs={12} spacing={1}>
        <Grid xs={12} sm={12} md={6}>
          <Typography variant="body1">{label}</Typography>
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>{label}</InputLabel>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value } }) => (
                <Select
                  label={label}
                  onChange={onChange}
                  value={value}
                  error={errorMessage != null && errorMessage !== ''}
                  // defaultValue="date_index"
                >
                  {/* Create optional None option */}
                  {isOptional ? (
                    <MenuItem key="" value="">
                      <em>None</em>
                    </MenuItem>
                  ) : null}

                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{description}</FormHelperText>
          </FormControl>
        </Grid>
        <Typography variant="inherit" color="textSecondary">
          {errorMessage}
        </Typography>
      </Grid>
    </CustomCard>
  );
};

export default CustomSelect;
