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
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { MatchResult } from 'demos/matching-engine/queries';
import * as React from 'react';
interface MatchResultsTableProps {
  results: MatchResult[];
}

export const MatchResultsTable = ({ results }: MatchResultsTableProps) => {
  const theme = useTheme();

  return (
    <TableContainer
      sx={{
        border: '2px solid',
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
        <TableHead sx={{ borderBottom: `2px solid ${theme.palette.grey[300]}` }}>
          <TableRow>
            <TableCell>
              <Typography variant="overline">Rank</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="overline">Item</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="overline">Distance</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow
              key={index}
              sx={{
                borderBottom: `2px solid ${theme.palette.grey[300]}`,
                '&:last-child, &:last-child': { borderBottom: 0 },
              }}
            >
              <TableCell>
                <Typography variant="overline">{index + 1}</Typography>
              </TableCell>
              {result.image ? (
                <TableCell>
                  {(result.url ?? result.image) != null ? (
                    <a href={result.url ?? result.image} target="_blank" rel="noreferrer">
                      <CardMedia
                        component="img"
                        sx={{
                          objectFit: 'cover',
                          width: '120px',
                          height: '120px',
                          display: 'inline-block',
                        }}
                        src={result.image}
                        alt={result.text}
                      />
                    </a>
                  ) : (
                    <CardMedia
                      component="img"
                      sx={{
                        objectFit: 'cover',
                        width: '120px',
                        height: '120px',
                        display: 'inline-block',
                      }}
                      src={result.image}
                      alt={result.text}
                    />
                  )}
                </TableCell>
              ) : (
                <TableCell component="th" scope="row">
                  <Typography variant="body1">
                    {result.url != null ? (
                      <a href={result.url} target="_blank" rel="noreferrer">
                        {result.text}
                      </a>
                    ) : (
                      result.text
                    )}
                  </Typography>
                </TableCell>
              )}
              <TableCell align="right">{result.distance.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
