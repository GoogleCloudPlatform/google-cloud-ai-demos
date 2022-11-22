import {
  Alert,
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
import { classifyImage, ImageClassificationResponse } from 'demos/image-classification/queries';
import * as React from 'react';
import { useQuery } from 'react-query';

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    id: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    id: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    id: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    id: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    id: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    id: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    id: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    id: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    id: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    id: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    id: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    id: 'Bike',
  },
];

interface ClassificationResult {
  class: string;
  score: number;
}

const CLASSIFICATION_RESULTS: ClassificationResult[] = [
  { class: 'bird', score: 0.6 },
  { class: 'dolphin', score: 0.2 },
  { class: 'cat', score: 0.3 },
];

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
  selectedImageId?: string;
  onImageSelected: (imageId: string) => void;
}

const ImageSelectionList = ({ selectedImageId, onImageSelected }: ImageListProps) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {itemData.map((item) => (
        <ImageListItem key={item.id}>
          <ImageButton focusRipple key={item.title} onClick={() => onImageSelected(item.id)}>
            <ImageSrc style={{ backgroundImage: `url(${item.img}?w=164&h=164&fit=crop&auto=format)` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              {selectedImageId == item.id ? (
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
            These results describe how confident the model is for each of these classes
          </Typography>
          <ClassificationResultsTable results={CLASSIFICATION_RESULTS} />
        </>
      );
    } else if (isError && error) {
      return (
        <Alert icon={<CircularProgress size={3} />} severity="error">
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

export default () => {
  const [selectedImageId, setSelectedImageId] = React.useState<string>();

  const onImageSelected = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid xs={12} md={4}>
          <Typography variant="h3">Select an image</Typography>
          <ImageSelectionList selectedImageId={selectedImageId} onImageSelected={onImageSelected} />
        </Grid>
        <Grid xs={12} md={8}>
          {selectedImageId != null ? (
            <>
              <Typography variant="h4">Classification results</Typography>
              <ClassificationResultsForImage selectedImageId={selectedImageId} />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};
