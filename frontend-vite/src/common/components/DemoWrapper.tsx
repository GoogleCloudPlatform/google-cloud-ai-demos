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

import { Box, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import theme from 'theme/demoTheme';

interface DemoThemingProps {
  children: React.ReactNode;
}

interface DemoSection {
  buttonText: string;
  title: string;
  element: React.ReactElement;
}

// The theme wrapper for the demos
export const DemoTheming = ({ children }: DemoThemingProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

interface DemoWrapperProps {
  title: string;
  subtitle: string;
  sections: DemoSection[];
  initialTabIndex?: number;
}

const DemoWrapper = ({ initialTabIndex, title, subtitle, sections }: DemoWrapperProps) => {
  const [selectedTabIndex, setTab] = React.useState<number>(initialTabIndex ?? 0);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newTab: number) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  if (sections.length == 0) {
    return null;
  }

  return (
    <Stack spacing={0} height="100%" direction="column">
      <Stack spacing={3} padding={4} flex="none" sx={{ marginBottom: '24px' }}>
        <Typography variant="h2" align="center">
          {title}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {subtitle}
        </Typography>
        <Box alignSelf="center">
          <ToggleButtonGroup color="primary" value={selectedTabIndex} exclusive onChange={handleChange}>
            {sections.map((section, index) => (
              <ToggleButton key={index} value={index}>
                {section.buttonText}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Stack>
      <Box sx={{ backgroundColor: '#1414460d' }} flex="1 1 0" paddingTop={2}>
        <Divider
          component="div"
          role="presentation"
          sx={{
            '&::before, &::after': {
              borderColor: theme.palette.grey[300],
            },
            width: '100%',
            paddingLeft: 3,
            paddingRight: 3,
          }}
        >
          <Typography variant="body2">{sections[selectedTabIndex].title}</Typography>
        </Divider>
        <Box padding={3} marginTop={3}>
          <DemoTheming>{sections[selectedTabIndex].element}</DemoTheming>
        </Box>
      </Box>
    </Stack>
  );
};

export default DemoWrapper;
