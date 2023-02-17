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
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import CustomCard from 'common/components/CustomCard';
import { SelectionList } from 'demos/matching-engine/image-recommendation/pages/SelectionList';
import {
  getWords,
  ItemInfo,
  ItemInfosResponse,
  MatchResponse,
  MatchResult,
  matchWord,
} from 'demos/matching-engine/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

interface MatchResultsTableProps {
  results: MatchResult[];
}

const MatchResultsTable = ({ results }: MatchResultsTableProps) => {
  return (
    <List>
      {results.map((result) => (
        <ListItem key={result.image}>
          <CustomCard sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" height="140" image={result.image} />
            <CardContent>
              <Typography gutterBottom variant="subtitle1" component="div">
                Distance: {result.distance}
              </Typography>
            </CardContent>
          </CustomCard>
        </ListItem>
      ))}
    </List>
  );
};

interface MatchResultsProps {
  selectedId: string;
}

const MatchResults = ({ selectedId }: MatchResultsProps) => {
  const {
    isLoading,
    error,
    data: matchResults,
    isError,
  } = useQuery<MatchResponse, Error>(
    ['submitForecast', selectedId],
    () => {
      return matchWord(selectedId);
    },
    {
      // The query will not execute until the jobId exists
      enabled: !!selectedId,
    }
  );

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (selectedId != null) {
    if (isLoading) {
      return (
        <Alert icon={<CircularProgress size={3} />} severity="info">
          Loading...
        </Alert>
      );
    } else if (matchResults != null) {
      return (
        <>
          <Typography variant="body1">These are the closest matchs for your selected image.</Typography>
          <Typography variant="subtitle2">
            {matchResults.results.length} results retrieved from a total of {matchResults.totalItems} images.
          </Typography>
          <MatchResultsTable results={matchResults.results} />
        </>
      );
    } else if (isError && error) {
      return (
        <Alert icon={<CircularProgress size={3} />} severity="error">
          <AlertTitle>Could not load results</AlertTitle>
          {(error as AxiosError).message}
        </Alert>
      );
    } else {
      return null;
    }
  } else if (isError && error != null) {
    return <Alert severity="error">{error.message}</Alert>;
  } else {
    return <Alert severity="error">Unknown error</Alert>;
  }
};

interface MatchFlowProps {
  items: ItemInfo[];
}

const MatchFlow = ({ items }: MatchFlowProps) => {
  const [selectedId, setSelectedId] = React.useState<string>();

  const onSelected = (id: string) => {
    setSelectedId(id);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid sx={{ width: '800px' }}>
          <Typography variant="h3">Select an item</Typography>
          <SelectionList items={items} selectedId={selectedId} onSelected={onSelected} />
        </Grid>
        <Grid>
          {selectedId != null ? (
            <>
              <Typography variant="h6">Nearest neighbors</Typography>
              <br />
              <MatchResults selectedId={selectedId} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default () => {
  // const {
  //   isLoading,
  //   error,
  //   data: itemsResponse,
  //   isError,
  // } = useQuery<ItemInfosResponse, Error>(['getImages'], () => {
  //   return getImages();
  // });

  const {
    isLoading,
    error,
    data: itemsResponse,
    isError,
  } = useQuery<ItemInfosResponse, Error>(['getWords'], () => {
    return getWords();
  });

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (itemsResponse != null) {
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
