import { PropsWithChildren } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Router from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Props extends PropsWithChildren {
  window?: () => Window;
}

const drawerWidth = 240;

export default function Layout({ children, window }: Props) {
  const supabaseClient = useSupabaseClient();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function onMenuItemSelected(index: number) {
    setSelectedIndex(index);

    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }

    Router.push(`/${sections[index].name.toLowerCase()}`);
  }

  const drawer = (
    <List component="nav">
      {sections.map((element, index) => {
        return (
          <ListItemButton
            key={index}
            selected={selectedIndex == index}
            onClick={() => onMenuItemSelected(index)}
          >
            <ListItemIcon>{element.icon}</ListItemIcon>
            <ListItemText primary={element.name} />
          </ListItemButton>
        );
      })}
    </List>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Head>
        <title>My Tennis Coach 🎾</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="skip">
        <Box sx={{ display: 'flex', height: '100%' }}>
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              justifyContent: 'space-between',
              flexDirection: 'row'
            }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                My Tennis Coach
              </Typography>
            </Toolbar>
            <Button
              color="inherit"
              onClick={async () => {
                await supabaseClient.auth.signOut();
                Router.push('/');
              }}
            >
              Sign-out
            </Button>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              display: { xs: 'none', sm: 'block' },
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box'
              }
            }}
          >
            <Toolbar /> {/* Invisible and unusuable toolbar for extra space */}
            <Box sx={{ overflow: 'auto' }}>{drawer}</Box>
          </Drawer>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth
              }
            }}
          >
            <Toolbar /> {/* Invisible and unusuable toolbar for extra space */}
            {drawer}
          </Drawer>
          <Box sx={{ width: '100%', padding: 2 }}>
            <Toolbar /> {/* Invisible and unusuable toolbar for extra space */}
            {children}
          </Box>
        </Box>
      </main>
    </>
  );
}

const sections = [
  {
    name: 'Dashboard',
    icon: <DashboardIcon />
  },
  {
    name: 'Schedule',
    icon: <CalendarMonthIcon />
  },
  {
    name: 'Trainings',
    icon: <FitnessCenterIcon />
  },
  {
    name: 'Matches',
    icon: <SportsTennisIcon />
  },
  {
    name: 'Opponents',
    icon: <PeopleIcon />
  }
];
