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

import { createTheme, ThemeOptions } from '@mui/material/styles';

import palette from './palette';
import Typography from './typography';

const themeTypography = Typography(`'DM Sans'`);

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
  }
}

const theme = createTheme({
  direction: 'ltr',
  mixins: {
    toolbar: {
      minHeight: 60,
      paddingTop: 8,
      paddingBottom: 8,
    },
  },
  palette: palette,
  typography: themeTypography,
} as ThemeOptions);

export default theme;
