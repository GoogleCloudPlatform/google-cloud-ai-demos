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

import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as VertexAIIcon } from 'static/vertex-ai-36-color.svg';

const pages: { displayName: string; to: string }[] = [
  // { displayName: 'More demos', to: '/' },
  // { displayName: 'Chat with us', to: '/chat' },
];

const ResponsiveAppBar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SvgIcon component={VertexAIIcon} inheritViewBox sx={{ m: '12px' }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              color: theme.palette.text.secondary,
              flexGrow: 1,
            }}
          >
            AI Demos
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.displayName}
                href={page.to}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: theme.palette.text.secondary, display: 'block' }}
              >
                {page.displayName}
              </Button>
            ))}
          </Box>

          {/* Small */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.displayName} component={Link} to={page.to} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    sx={{
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {page.displayName}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Cymbal
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
