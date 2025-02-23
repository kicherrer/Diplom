import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  Popover
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
}

interface ThemeSettings {
  colors: ThemeColors;
  darkMode: boolean;
  fontSize: {
    base: number;
    heading: number;
  };
  spacing: number;
  borderRadius: number;
  headerStyle: 'fixed' | 'scrollable';
  footerVisible: boolean;
  customCss: string;
}

export const ThemeSettings: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>({
    colors: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
    },
    darkMode: false,
    fontSize: {
      base: 16,
      heading: 24,
    },
    spacing: 8,
    borderRadius: 4,
    headerStyle: 'fixed',
    footerVisible: true,
    customCss: '',
  });

  const [activeTab, setActiveTab] = useState(0);
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [activeColor, setActiveColor] = useState<keyof ThemeColors | null>(null);

  const handleColorClick = (
    event: React.MouseEvent<HTMLElement>,
    colorKey: keyof ThemeColors
  ) => {
    setColorAnchor(event.currentTarget);
    setActiveColor(colorKey);
  };

  const handleColorClose = () => {
    setColorAnchor(null);
    setActiveColor(null);
  };

  const handleColorChange = (newColor: string) => {
    if (activeColor) {
      setSettings(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [activeColor]: newColor
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Save settings to backend
      // Update theme in real-time
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Настройки оформления</Typography>
        <Button variant="contained" onClick={handleSave}>
          Сохранить изменения
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Основные" />
          <Tab label="Цвета" />
          <Tab label="Типографика" />
          <Tab label="Дополнительно" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      darkMode: e.target.checked
                    }))}
                  />
                }
                label="Тёмная тема"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Отступы (px)</Typography>
              <Slider
                value={settings.spacing}
                min={4}
                max={24}
                step={2}
                marks
                onChange={(_, value) => setSettings(prev => ({
                  ...prev,
                  spacing: value as number
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Скругление углов (px)</Typography>
              <Slider
                value={settings.borderRadius}
                min={0}
                max={24}
                step={2}
                marks
                onChange={(_, value) => setSettings(prev => ({
                  ...prev,
                  borderRadius: value as number
                }))}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {Object.entries(settings.colors).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Typography gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {key}
                </Typography>
                <Box
                  onClick={(e) => handleColorClick(e, key as keyof ThemeColors)}
                  sx={{
                    width: 100,
                    height: 40,
                    bgcolor: value,
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Popover
          open={Boolean(colorAnchor)}
          anchorEl={colorAnchor}
          onClose={handleColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2 }}>
            <HexColorPicker
              color={activeColor ? settings.colors[activeColor] : '#000000'}
              onChange={handleColorChange}
            />
          </Box>
        </Popover>

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Базовый размер шрифта (px)</Typography>
              <Slider
                value={settings.fontSize.base}
                min={12}
                max={20}
                step={1}
                marks
                onChange={(_, value) => setSettings(prev => ({
                  ...prev,
                  fontSize: {
                    ...prev.fontSize,
                    base: value as number
                  }
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Размер заголовков (px)</Typography>
              <Slider
                value={settings.fontSize.heading}
                min={18}
                max={32}
                step={2}
                marks
                onChange={(_, value) => setSettings(prev => ({
                  ...prev,
                  fontSize: {
                    ...prev.fontSize,
                    heading: value as number
                  }
                }))}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={10}
                label="Пользовательский CSS"
                value={settings.customCss}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customCss: e.target.value
                }))}
                helperText="Введите дополнительные CSS правила"
              />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};
