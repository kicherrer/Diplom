import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Paper,
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  PeopleAlt,
  Movie,
  Settings,
  Analytics,
  ImportExport,
  Notifications,
} from '@mui/icons-material';
import { useNavigate, Route, Routes } from 'react-router-dom';

const DRAWER_WIDTH = 240;

export const AdminDashboard: React.FC = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Users', icon: <PeopleAlt />, path: '/admin/users' },
    { text: 'Content', icon: <Movie />, path: '/admin/content' },
    { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
    { text: 'Import', icon: <ImportExport />, path: '/admin/import' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? DRAWER_WIDTH : 0}px)`,
          ml: `${open ? DRAWER_WIDTH : 0}px`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <Avatar sx={{ ml: 2 }} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: [1],
          }}
        >
          <Typography variant="h6" color="primary">
            Cinema Admin
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4" color="primary">
                1,234
              </Typography>
              <Typography variant="subtitle1">Active Users</Typography>
            </Paper>
          </Grid>
          {/* Add more stat cards */}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<div>Dashboard Content</div>} />
            <Route path="/users" element={<div>Users Management</div>} />
            <Route path="/content" element={<div>Content Management</div>} />
            <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
            <Route path="/import" element={<div>Import Content</div>} />
            <Route path="/settings" element={<div>System Settings</div>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};
