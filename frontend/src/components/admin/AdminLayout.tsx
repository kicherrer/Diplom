import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Movie,
  People,
  Settings,
  BarChart,
  CloudUpload,
  Category,
  ViewCarousel,
  Palette,
  ArrowDropDown,
  Logout,
  Download,
  SecurityOutlined,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const menuItems = [
  {
    title: 'Основное',
    items: [
      { path: '/admin', icon: <Dashboard />, label: 'Панель управления' },
      { path: '/admin/analytics', icon: <BarChart />, label: 'Аналитика' },
    ]
  },
  {
    title: 'Контент',
    items: [
      { path: '/admin/movies', icon: <Movie />, label: 'Фильмы и сериалы' },
      { path: '/admin/categories', icon: <Category />, label: 'Категории' },
      { path: '/admin/import', icon: <CloudUpload />, label: 'Импорт контента' },
      { path: '/admin/torrents', icon: <Download />, label: 'Загрузки' },
    ]
  },
  {
    title: 'Пользователи',
    items: [
      { path: '/admin/users', icon: <People />, label: 'Пользователи' },
      { path: '/admin/roles', icon: <SecurityOutlined />, label: 'Роли и права' },
    ]
  },
  {
    title: 'Оформление',
    items: [
      { path: '/admin/banners', icon: <ViewCarousel />, label: 'Баннеры' },
      { path: '/admin/appearance', icon: <Palette />, label: 'Внешний вид' },
    ]
  },
  {
    title: 'Система',
    items: [
      { path: '/admin/settings', icon: <Settings />, label: 'Настройки' },
    ]
  },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Implement logout logic
    handleProfileMenuClose();
  };

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
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Административная панель
          </Typography>
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
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
            bgcolor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: [1],
            py: 2,
          }}
        >
          <Typography variant="h5" color="primary" fontWeight="bold">
            CinemaAdmin
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ pt: 0 }}>
          {menuItems.map((section) => (
            <React.Fragment key={section.title}>
              <ListItem
                button
                onClick={() => handleMenuClick(section.title)}
                sx={{ py: 1.5 }}
              >
                <ListItemText
                  primary={section.title}
                  sx={{ color: 'text.secondary' }}
                />
                <ArrowDropDown
                  sx={{
                    transform: expandedSection === section.title ? 'rotate(-180deg)' : 'none',
                    transition: '0.2s',
                  }}
                />
              </ListItem>
              <Collapse in={expandedSection === section.title}>
                <List disablePadding>
                  {section.items.map((item) => (
                    <ListItem
                      button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      selected={location.pathname === item.path}
                      sx={{
                        pl: 4,
                        py: 1,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: location.pathname === item.path
                            ? 'primary.contrastText'
                            : 'inherit'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </MenuItem>
      </Menu>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
