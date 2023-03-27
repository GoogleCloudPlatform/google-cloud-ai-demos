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
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { getMatchServiceInfo, MatchServiceInfo } from 'demos/matching-engine/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

import MatchSelectionAndResults from '../components/MatchSelectionAndResults';

export default () => {
  const {
    isLoading,
    error,
    data: matchServiceInfos,
    isError,
  } = useQuery<MatchServiceInfo[], Error>(
    ['getMatchServiceInfo'],
    () => {
      return getMatchServiceInfo();
    },
    { refetchOnWindowFocus: false }
  );

  // Selected tab state
  const [selectedTabIndex, setTab] = React.useState<number>(0);
  const handleChange = (event: React.MouseEvent<HTMLElement>, newTab: number) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  const selectedServiceInfo =
    matchServiceInfos != null && matchServiceInfos.length > 0 ? matchServiceInfos[selectedTabIndex] : null;

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (matchServiceInfos != null && selectedServiceInfo != null) {
    return (
      <Stack spacing={2} flex="none">
        <Box alignSelf="center">
          <ToggleButtonGroup color="primary" value={selectedTabIndex} exclusive onChange={handleChange}>
            {matchServiceInfos.map((matchServiceInfo, index) => (
              <ToggleButton key={index} value={index}>
                {matchServiceInfo.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Typography variant="body1" align="center">
          {selectedServiceInfo.description}
        </Typography>
        {selectedServiceInfo.code != null ? (
          <Box alignSelf="center">
            <Alert severity="info" sx={{ width: 'fit-content' }}>
              See code at{' '}
              <a href={selectedServiceInfo.code.url} target="_blank" rel="noreferrer">
                {selectedServiceInfo.code.title}
              </a>
            </Alert>
          </Box>
        ) : null}
        <MatchSelectionAndResults matchServiceInfo={matchServiceInfos[selectedTabIndex]} />
      </Stack>
    );
  } else if (isError && error) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="error">
        <AlertTitle>Could not load match service info</AlertTitle>
        {error.message}
      </Alert>
    );
  } else {
    return null;
  }
};
