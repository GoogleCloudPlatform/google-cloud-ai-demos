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
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import retailImage from 'demos/time-series-forecasting/static/retail.jpeg';
import * as React from 'react';

interface ScenarioCardProps {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  destination?: string;
}

const ScenarioCard = ({ title, description, image, tags, destination }: ScenarioCardProps) => {
  const theme = useTheme();
  return (
    <CustomCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea {...{ href: destination }}>
        <CardMedia component="img" height="140" image={image} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {description}
          </Typography>
          {tags != null && tags.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {tags.map((tag) => (
                // <Chip label={tag} color="text.primary" />;
                <Chip key={tag} label={tag} variant="outlined" />
              ))}
              {/* <Chip label="primary" color="text.primary" /> */}
              {/* <Chip label="Chip Outlined" variant="outlined" /> */}
            </Stack>
          ) : null}
        </CardContent>
        {/* <CardActions>
        {destination ? (
          <Button size="small" href={destination}>
            Explore
          </Button>
        ) : (
          <Button size="small" disabled>
            Coming soon
          </Button>
        )}
      </CardActions> */}
      </CardActionArea>
    </CustomCard>
  );
};

interface SectionProps {
  title: string;
  description: string;
  scenarios: ScenarioCardProps[];
}

const Section = ({ title, description, scenarios }: SectionProps) => {
  return (
    <Grid container spacing={6}>
      <Grid xs={12} sm={4}>
        <Typography variant="h4">{title}</Typography>
        <br />
        <Typography variant="body1">{description}</Typography>
      </Grid>
      {/* <Grid container xs={12} sm={8} spacing={2}> */}
      {scenarios.map((scenario) => {
        return (
          <Grid key={scenario.title} xs={12} sm={4}>
            <ScenarioCard {...scenario} />
          </Grid>
        );
      })}
      {/* </Grid> */}
      <Divider />
    </Grid>
  );
};

const sectionInfos = [
  {
    title: 'Forecasting',
    description:
      "Forecasting is the science of predicting future data with existing data. It's useful in a variety of fields and has many practical applications.",
    scenarios: [
      {
        title: 'Time-series forecasting',
        description:
          'Learn how to create a forecasting web app to predict future sales with Cloud Run, BigQuery ML and Vertex AI.',
        image: retailImage,
        destination: '/demos/time-series-forecasting',
      },
    ],
  },
  // {
  //   title: 'Image',
  //   description:
  //     'AutoML uses machine learning to analyze the content of image data. You can use AutoML to train an ML model to classify image data or find objects in image data.',
  //   scenarios: [
  //     {
  //       title: 'Image classification',
  //       description:
  //         'A classification model analyzes image data and returns a list of content categories that apply to the image. For example, you can train a model that classifies images as containing a cat or not containing a cat, or you could train a model to classify images of dogs by breed.',
  //       image: retailImage,
  //       destination: '/demos/image-classification',
  //     },
  //     {
  //       title: 'Object detection',
  //       description:
  //         'An object detection model analyzes your image data and returns annotations for all objects found in an image, consisting of a label and bounding box location for each object. For example, you can train a model to find the location of the cats in image data.',
  //       image: retailImage,
  //       destination: '/demos/todo',
  //     },
  //   ],
  // },
  {
    title: 'Matching Engine',
    description:
      "Vertex AI Matching Engine provides the industry's leading high-scale low latency vector database (a.k.a, vector similarity-matching or approximate nearest neighbor service).",
    scenarios: [
      {
        title: 'Similarity search',
        description: 'Search for similar items based on a text or image prompt',
        image: retailImage,
        destination: '/demos/matching-engine',
      },
    ],
  },
];

export default () => {
  return (
    <Container maxWidth="lg">
      <Stack spacing={7}>
        <Typography variant="display1">Demos</Typography>
        <Typography variant="body1">
          These live demos demonstrate how to use Vertex AI with other Google Cloud products across a variety of use
          cases. Each example has an interactive demo with fully deployable code.
        </Typography>
        {sectionInfos.map(({ title, description, scenarios }) => {
          return <Section key={title} title={title} description={description} scenarios={scenarios} />;
        })}
      </Stack>
    </Container>
  );
};
