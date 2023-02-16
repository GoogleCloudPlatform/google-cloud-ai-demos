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
import ButtonBase from '@mui/material/ButtonBase';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import CustomCard from 'common/components/CustomCard';
import {
  fetchMatchs,
  getImages,
  ItemInfo,
  ItemInfosResponse,
  MatchResponse,
  MatchResult,
} from 'demos/matching-engine/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

interface ImageListProps {
  items: ItemInfo[];
  selectedImageId?: string;
  onSelected?: (imageId: string) => void;
}

const ImageSelectionList = ({ items, selectedImageId: selectedId, onSelected }: ImageListProps) => {
  return (
    <ImageList sx={{ width: '100%', maxHeight: '800px' }} cols={3}>
      {items.map((item) => (
        <ImageListItem key={item.id}>
          <ImageButton
            focusRipple
            key={item.title}
            onClick={() => {
              if (onSelected != null) {
                onSelected(item.id);
              }
            }}
          >
            <ImageSrc style={{ backgroundImage: `url(${item.img}?w=164&h=164&fit=crop&auto=format)` }} />
            {selectedId == item.id ? <ImageBackdrop className="MuiImageBackdrop-root" /> : null}
            <Image>
              {selectedId == item.id ? (
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    position: 'relative',
                    p: 4,
                    pt: 2,
                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                  }}
                >
                  Selected
                  <ImageMarked className="MuiImageMarked-root" />
                </Typography>
              ) : null}
            </Image>
          </ImageButton>
        </ImageListItem>
      ))}
    </ImageList>
  );
};

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

interface MatchResultsForImageProps {
  selectedImageId: string;
}

const MatchResultsForImage = ({ selectedImageId }: MatchResultsForImageProps) => {
  const {
    isLoading,
    error,
    data: matchResults,
    isError,
  } = useQuery<MatchResponse, Error>(
    ['submitForecast', selectedImageId],
    () => {
      return fetchMatchs(selectedImageId);
    },
    {
      // The query will not execute until the jobId exists
      enabled: !!selectedImageId,
    }
  );

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (selectedImageId != null) {
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
            {matchResults.results.length} results retrieved from a total of {matchResults.totalImageCount} images.
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

interface ImageMatchFlowForImagesProps {
  items: ItemInfo[];
}

const MatchFlow = ({ items }: ImageMatchFlowForImagesProps) => {
  const [selectedImageId, setSelectedImageId] = React.useState<string>();

  const onSelected = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid sx={{ width: '800px' }}>
          <Typography variant="h3">Select an image</Typography>
          <ImageSelectionList items={items} selectedImageId={selectedImageId} onSelected={onSelected} />
        </Grid>
        <Grid>
          {selectedImageId != null ? (
            <>
              <Typography variant="h6">Match results</Typography>
              <br />
              <MatchResultsForImage selectedImageId={selectedImageId} />
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
  } = useQuery<ItemInfosResponse, Error>(['getImages'], () => {
    return getImages();
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
