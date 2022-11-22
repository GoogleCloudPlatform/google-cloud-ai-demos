import { Container, Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
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
  selectedImage?: number;
  onImageSelected: (index: number) => void;
}

const ImageSelectionList = ({ selectedImage, onImageSelected }: ImageListProps) => {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {itemData.map((item, index) => (
        <ImageListItem key={index}>
          <ImageButton focusRipple key={item.title} onClick={() => onImageSelected(index)}>
            <ImageSrc style={{ backgroundImage: `url(${item.img}?w=164&h=164&fit=crop&auto=format)` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              {selectedImage == index ? (
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
export default () => {
  const [selectedImage, setSelectedImage] = React.useState<number>();

  const onImageSelected = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid xs={12} md={4}>
          <Typography variant="h3">Select an image</Typography>
          <ImageSelectionList selectedImage={selectedImage} onImageSelected={onImageSelected} />
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h6">Classification results</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
