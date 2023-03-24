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

import { Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { styled } from '@mui/material/styles';
import { ItemInfo } from 'demos/matching-engine/queries';
import * as React from 'react';

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

const ImageSrc = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  backgroundColor: theme.palette.secondary.light,
}));

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
  width: 50,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 25px)',
  transition: theme.transitions.create('opacity'),
}));

interface ImageSelectionButtonProps {
  item: ItemInfo;
  isSelected: boolean;
  onSelected?: () => void;
}

export const ImageSelectionButton = ({ item, isSelected, onSelected }: ImageSelectionButtonProps) => {
  return (
    <ImageButton
      focusRipple
      key={item.text}
      onClick={() => {
        if (onSelected != null) {
          onSelected();
        }
      }}
    >
      <ImageSrc
        style={{
          backgroundImage: item.img != null ? `url(${item.img}?w=164&h=164&fit=crop&auto=format)` : undefined,
        }}
      />
      {isSelected ? (
        <ImageBackdrop className="MuiImageBackdrop-root" style={{ opacity: 0.9 }} />
      ) : (
        <ImageBackdrop className="MuiImageBackdrop-root" />
      )}
      <Image>
        <Typography
          component="span"
          variant="h4"
          color="inherit"
          sx={{
            position: 'relative',
            p: 4,
            pt: 2,
            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            fontWeight: isSelected ? 'bold' : 'null',
          }}
        >
          {item.text}
          {isSelected ? <ImageMarked className="MuiImageMarked-root" /> : null}
        </Typography>
      </Image>
    </ImageButton>
  );
};
interface SelectionListProps {
  items: ItemInfo[];
  selectedIndex?: number;
  onSelected?: (item: ItemInfo, index: number) => void;
}

export const SelectionList = ({ items, selectedIndex, onSelected }: SelectionListProps) => {
  return (
    <ImageList sx={{ width: '100%', maxHeight: '800px', marginTop: 0 }} cols={3}>
      {items.map((item, index) => (
        <ImageListItem key={index}>
          <ImageSelectionButton
            item={item}
            isSelected={selectedIndex == index}
            onSelected={() => {
              if (onSelected != null) {
                onSelected(item, index);
              }
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
