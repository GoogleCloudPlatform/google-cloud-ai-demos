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

import { Card, CardHeader, Divider, SxProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
interface CustomCardProps {
  avatar?: React.ReactNode;
  children?: React.ReactNode | React.ReactNode[];
  content?: boolean;
  contentSX?: SxProps;
  action?: React.ReactNode | string;
  subheader?: React.ReactNode | string;
  sx?: SxProps;
  title?: React.ReactNode | string;
}

const CustomCard = ({ avatar, children, action, subheader, sx = {}, title, ...others }: CustomCardProps) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      {...others}
      sx={{
        ...sx,
        border: '1px solid',
        borderRadius: 2,
        borderColor: theme.palette.grey[300],
      }}
    >
      {/* Card header and action */}
      {title && (
        <>
          <CardHeader
            sx={{
              p: 2.5,
              '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' },
            }}
            titleTypographyProps={{ variant: 'subtitle1' }}
            avatar={avatar}
            title={title}
            action={action}
            subheader={subheader}
          />
          <Divider />
        </>
      )}

      {/* Card content */}
      {children}
    </Card>
  );
};

export default CustomCard;
