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

import palette from './palette';

const Typography = (fontFamily) => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  display1: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '64px',
    lineHeight: '76px',
  },
  h1: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '36px',
    lineHeight: '44px',
  },
  h2: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '32px',
    lineHeight: '40px',
  },
  h3: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '28px',
    lineHeight: '36px',
  },
  h4: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '24px',
    lineHeight: '32px',
  },
  h5: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '22px',
    lineHeight: '28px',
  },
  h6: {
    color: palette.text.primary,
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '24px',
  },
  subtitle1: {
    fontWeight: 500,
    color: palette.text.primary,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.2px',
  },
  subtitle2: {
    color: palette.text.secondary,
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '0.25px',
    lineHeight: '20px',
  },
  overline: {
    color: palette.text.secondary,
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  body1: {
    color: palette.text.primary,
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.1px',
  },
  body2: {
    color: palette.text.secondary,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0.2px',
  },
  button: {
    color: palette.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  caption: {
    color: palette.text.secondary,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0.3px',
  },
});

export default Typography;
