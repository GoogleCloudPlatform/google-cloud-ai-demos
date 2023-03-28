/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface DebouncedTextFieldProps {
  text: string;
  setText: (text: string) => void;
  textChanged: (text: string) => void;
}

const DebouncedTextField = ({ text, setText, textChanged }: DebouncedTextFieldProps) => {
  const [debouncedValue] = useDebounce(text, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setText(newText);
  };

  useEffect(() => {
    textChanged(debouncedValue);
  }, [debouncedValue, textChanged]);

  return (
    <TextField
      label="Search"
      value={text}
      onChange={handleChange}
      fullWidth
      disabled={false}
      helperText="Type a search query here"
    />
  );
};

export default DebouncedTextField;
