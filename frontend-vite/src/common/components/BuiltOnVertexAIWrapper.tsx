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

import { Box, Stack } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DemoNavBar from 'common/components/NavBar';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import theme from 'theme/theme';

interface ThemingProps {
  children: React.ReactElement;
}
// The theme wrapper for the demos
const Theming = ({ children }: ThemingProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

interface BuiltOnVertexAIWrapperProps {
  children: React.ReactElement;
}

const BuiltOnVertexAIWrapper = ({ children }: BuiltOnVertexAIWrapperProps) => {
  return (
    <Theming>
      <Stack minHeight="100vh" margin={0} padding={0}>
        <BrowserRouter>
          <DemoNavBar />
        </BrowserRouter>
        <Box sx={{ flex: '1 1 0' }}>{children}</Box>
      </Stack>
    </Theming>
  );
};

export default BuiltOnVertexAIWrapper;
