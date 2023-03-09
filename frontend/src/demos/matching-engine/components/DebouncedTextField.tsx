import TextField from '@mui/material/TextField';
import React from 'react';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface DebouncedTextFieldProps {
  textChanged: (text: string) => void;
  text: string;
  setText: (text: string) => void;
}

const DebouncedTextField = ({ textChanged, text, setText }: DebouncedTextFieldProps) => {
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
