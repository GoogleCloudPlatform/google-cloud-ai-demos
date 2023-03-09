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
  CircularProgress,
  Container,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import {
  ClassificationResult,
  classifyImage,
  getImages,
  ImageClassificationResponse,
  ImageInfo,
  ImageInfosResponse,
} from 'demos/image-classification/queries';
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
  images: ImageInfo[];
  selectedImageId?: string;
  onImageSelected?: (imageId: string) => void;
}

const ImageSelectionList = ({ images, selectedImageId, onImageSelected }: ImageListProps) => {
  return (
    <ImageList sx={{ width: '100%', maxHeight: '800px' }} cols={3}>
      {images.map((image, index) => (
        <ImageListItem key={image.id}>
          <ImageButton
            focusRipple
            key={index}
            onClick={() => {
              if (onImageSelected != null) {
                onImageSelected(image.id);
              }
            }}
          >
            <ImageSrc style={{ backgroundImage: `url(${image.img}?w=164&h=164&fit=crop&auto=format)` }} />
            {selectedImageId == image.id ? <ImageBackdrop className="MuiImageBackdrop-root" /> : null}
            <Image>
              {selectedImageId == image.id ? (
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

interface ClassificationResultsTableProps {
  results: ClassificationResult[];
}

const ClassificationResultsTable = ({ results }: ClassificationResultsTableProps) => {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{
        border: '1px solid',
        borderRadius: 2,
        borderColor: theme.palette.grey[300],
        '& pre': {
          m: 0,
          p: '16px !important',
          fontFamily: theme.typography.fontFamily,
          fontSize: '0.75rem',
        },
        boxShadow: null,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.class} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {result.class}
              </TableCell>
              <TableCell align="right">
                <Slider
                  valueLabelDisplay="off"
                  value={result.score}
                  min={0}
                  max={1}
                  step={0.1}
                  marks={[
                    {
                      value: result.score,
                      label: `${result.score}`,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface ClassificationResultsForImageProps {
  selectedImageId: string;
}

const ClassificationResultsForImage = ({ selectedImageId }: ClassificationResultsForImageProps) => {
  const {
    isLoading,
    error,
    data: classificationResults,
    isError,
  } = useQuery<ImageClassificationResponse, Error>(
    ['submitForecast', selectedImageId],
    () => {
      return classifyImage(selectedImageId);
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
    } else if (classificationResults != null) {
      return (
        <>
          <Typography variant="body1">
            These results describe how confident the model is for each of these classes.
          </Typography>
          <ClassificationResultsTable results={classificationResults.results} />
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

interface ImageClassificationFlowForImagesProps {
  images: ImageInfo[];
}

const ImageClassificationFlowForImages = ({ images }: ImageClassificationFlowForImagesProps) => {
  const [selectedImageId, setSelectedImageId] = React.useState<string>();

  const onImageSelected = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid sx={{ width: '800px' }}>
          <Typography variant="h3">Select an image</Typography>
          <ImageSelectionList images={images} selectedImageId={selectedImageId} onImageSelected={onImageSelected} />
        </Grid>
        <Grid>
          {selectedImageId != null ? (
            <>
              <Typography variant="h6">Classification results</Typography>
              <br />
              <ClassificationResultsForImage selectedImageId={selectedImageId} />
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
    data: imagesResponse,
    isError,
  } = useQuery<ImageInfosResponse, Error>(['getImages'], () => {
    return getImages();
  });

  if (isLoading) {
    return (
      <Alert icon={<CircularProgress size={3} />} severity="info">
        Loading...
      </Alert>
    );
  } else if (imagesResponse != null) {
    return <ImageClassificationFlowForImages images={imagesResponse.images} />;
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
