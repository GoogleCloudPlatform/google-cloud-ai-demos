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
  Button,
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
import energyImage from 'demos/time-series-forecasting/static/energy.png';
import financeImage from 'demos/time-series-forecasting/static/finance.jpeg';
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

// interface IntroductionProps {}

export default () => {
  const theme = useTheme();
  return (
    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="xl">
        <Grid container spacing={11} height="100%">
          <Grid xs={12} md={5}>
            <Stack marginTop={11} spacing={7}>
              <Typography variant="display1">Time-series Forecasting</Typography>
              <Typography variant="h6" color="secondary">
                Forecasting is the science of predicting future data with existing data. It&#39;s useful in a variety of
                fields and has many practical applications.
              </Typography>
              <Divider color={theme.palette.secondary.light} sx={{ height: 2, width: '95%', marginBottom: '24px' }} />
              {/* <Grid sx={{ flexDirection: 'column' }} xs={12} display="flex" justifyContent="center" alignItems="left"> */}
              <Stack direction="column" spacing={2}>
                <Typography variant="h1">Try it yourself</Typography>
                <Typography variant="body1">Pick a demo dataset and try out forecasting with Vertex AI.</Typography>
                <Box>
                  <Button
                    variant="contained"
                    disableElevation
                    href="/demos/forecasting/time-series/time-series-forecasting/new-forecast"
                    fullWidth={false}
                  >
                    Start
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={12} md={7} spacing={0} padding={0}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Typography variant="overline">Example forecasting use cases</Typography>
              </Grid>
              <Grid xs={12} sm={6}>
                <ScenarioCard
                  title="Retail"
                  description="Forecasting is often used to predict future sales across different products and stores. These inform downstream inventory, sales promotion and supply chain decisions. Click here to see an example of sales forecasting."
                  // icon="storefront"
                  image={retailImage}
                  destination="/examples/retail"
                  // tags={['hierarchical']}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ScenarioCard
                  title="WIP: Finance"
                  description="Forecasting can be used to track price fluctuations in assets and commodities. Click here to see an example of stock price forecasting."
                  // icon="MonetizationOn"
                  image={financeImage}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <ScenarioCard
                  title="WIP: Energy consumption"
                  description="Estimating future energy consumption is critical for policy makers to balance supply and demand. Accurate forecasts have profound implications on manufacturing, climate change and trade. In this example, we forecast energy demand using a variety of techniques."
                  // icon="ElectricBolt"
                  image={energyImage}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
