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

import MicIcon from '@mui/icons-material/Mic';
import { Box, Button, Card, CardMedia, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import chessboardPlaceholder from 'demos/speech-to-text/chess/static/placeholder.png';
import * as React from 'react';

export default () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={7}>
        <Grid xs={12} md={6}>
          <Card>
            <CardMedia component="img" image={chessboardPlaceholder} />
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
            <Stack direction="column" spacing={4}>
              <Typography variant="h3" align="center">
                It is your turn
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined">New Game</Button>
                <Button variant="contained" endIcon={<MicIcon />}>
                  Make a move
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
