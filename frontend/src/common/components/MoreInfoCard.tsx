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

import { Box, List, ListItem, Typography, useTheme } from '@mui/material';
import * as React from 'react';

interface MoreInfoRow {
  text: string;
  link?: string;
}

export interface MoreInfoCardProps {
  title?: string;
  subtitle?: string;
  rows: MoreInfoRow[];
}

export const MoreInfoCard = ({ title, rows }: MoreInfoCardProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ borderLeft: `2px solid ${theme.palette.grey[300]}`, paddingLeft: '24px' }}>
      <Typography variant="overline">{title}</Typography>
      <List
        sx={{
          listStyleType: 'disc',
          pl: 2,
        }}
        disablePadding
      >
        {rows.map((row, index) => (
          <ListItem
            key={index}
            sx={{
              display: 'list-item',
              color: theme.palette.grey[300],
            }}
          >
            <Typography variant="subtitle2">
              <a href={row.link} target="_blank" rel="noreferrer">
                {row.text}
              </a>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
