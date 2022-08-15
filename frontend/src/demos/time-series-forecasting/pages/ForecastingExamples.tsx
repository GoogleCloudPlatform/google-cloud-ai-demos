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
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomCard from 'common/components/CustomCard';
import RetailFlow from 'demos/time-series-forecasting/pages/explanations/RetailFlow';
import energyImage from 'demos/time-series-forecasting/static/energy.png';
import financeImage from 'demos/time-series-forecasting/static/finance.jpeg';
import retailImage from 'demos/time-series-forecasting/static/retail.jpeg';
import * as React from 'react';

interface ScenarioCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
  tags?: string[];
}

const ScenarioCard = ({ title, description, image, tags, onClick }: ScenarioCardProps) => {
  const theme = useTheme();
  return (
    <CustomCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea {...{ onClick: onClick }}>
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
                <Chip key={tag} label={tag} variant="outlined" />
              ))}
            </Stack>
          ) : null}
        </CardContent>
      </CardActionArea>
    </CustomCard>
  );
};

interface ExamplesProps {
  examples: Example[];
}

const Examples = ({ examples }: ExamplesProps) => {
  const [selectedExample, setSelectedExample] = React.useState<string | null>(null);

  const onBackButtonClicked = () => {
    setSelectedExample(null);
  };

  const example = examples.find((example) => example.title == selectedExample);

  if (selectedExample == null || example?.element == null) {
    return (
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="xl">
          <Grid xs={12} md={7} spacing={0} padding={0}>
            <Grid container spacing={3}>
              {examples.map((example) => {
                return (
                  <Grid key={example.title} xs={6} sm={4}>
                    <ScenarioCard
                      title={example.title}
                      description="Forecasting is often used to predict future sales across different products and stores. These inform downstream inventory, sales promotion and supply chain decisions. Click here to see an example of sales forecasting."
                      // icon="storefront"
                      image={example.image}
                      onClick={() => setSelectedExample(example.title)}
                      // tags={['hierarchical']}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  } else {
    return React.cloneElement(example.element, { onBackButtonClicked: onBackButtonClicked });
  }
};

interface Example {
  title: string;
  description: string;
  image: string;
  element?: React.ReactElement;
}

const examples: Example[] = [
  {
    title: 'Retail',
    description:
      'Forecasting is often used to predict future sales across different products and stores. These inform downstream inventory, sales promotion and supply chain decisions. Click here to see an example of sales forecasting.',
    image: retailImage,
    element: <RetailFlow />,
  },
  {
    title: 'Coming soon: Finance',
    description:
      'Forecasting can be used to track price fluctuations in assets and commodities. Click here to see an example of stock price forecasting.',
    image: financeImage,
  },
  {
    title: 'Coming soon: Energy consumption',
    description:
      'Estimating future energy consumption is critical for policy makers to balance supply and demand. Accurate forecasts have profound implications on manufacturing, climate change and trade. In this example, we forecast energy demand using a variety of techniques.',
    image: energyImage,
  },
];

export default () => {
  return <Examples examples={examples} />;
};
