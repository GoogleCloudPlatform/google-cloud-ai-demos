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
import { Alert, AlertTitle, CircularProgress, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import DebouncedTextField from 'demos/matching-engine/components/DebouncedTextField';
import { MatchResults } from 'demos/matching-engine/components/MatchResults';
import { SelectionList } from 'demos/matching-engine/pages/SelectionList';
import { getItems, ItemInfo, ItemInfosResponse } from 'demos/matching-engine/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

interface MatchFlowProps {
  items: ItemInfo[];
}

// const matchServiceId = 'stackoverflow_questions';
const matchServiceId = 'words';
const textInputAllowed = true;

const MatchFlow = ({ items }: MatchFlowProps) => {
  const [selectedId, setSelectedId] = React.useState<string | undefined>(undefined);

  // const onSelected = (id: string) => {
  //   setSelectedId(id);
  // };

  const [searchQuery, setSearchQuery] = React.useState('');
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid xs={12} md={8}>
          <Typography variant="h3">Select an item</Typography>
          {textInputAllowed ? <DebouncedTextField textChanged={handleSearch} /> : null}
          <SelectionList
            items={items}
            selectedId={selectedId}
            onSelected={(item: ItemInfo) => {
              if (item.id != null) {
                setSelectedId(item.id);
              } else if (item.text != null) {
                setSearchQuery(item.text);
              }
            }}
          />
        </Grid>
        <Grid xs={12} md={4}>
          {selectedId != null || searchQuery.length > 0 ? (
            <>
              <Typography variant="h6">Nearest neighbors</Typography>
              <br />
              <MatchResults matchServiceId={matchServiceId} selectedId={selectedId} searchQuery={searchQuery} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default () => {
  const {
    isLoading,
    error,
    data: itemsResponse,
    isError,
  } = useQuery<ItemInfosResponse, Error>(
    ['getItems'],
    () => {
      return getItems(matchServiceId);
    },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (itemsResponse != null && itemsResponse.items != null) {
    return <MatchFlow items={itemsResponse.items} />;
  } else if (isError && error) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="error">
        <AlertTitle>Could not load images</AlertTitle>
        {(error as AxiosError).message}
      </Alert>
    );
  } else {
    return null;
  }
};
