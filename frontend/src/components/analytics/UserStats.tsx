import React from 'react';
import { Box, Paper, Typography, Grid, CircularProgress, useTheme } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useQuery } from 'react-query';
import { api } from '../../api/client';
import { formatDuration } from '../../utils/time';

interface AnalyticsDay {
  date: string;
  total_time: number;
  content_watched: number;
}

interface UserStatsData {
  daily_stats: AnalyticsDay[];
  total_watch_time: number;
  total_content_watched: number;
  favorite_genres: [string, number][];
  completion_rate: number;
  average_session: number;
}

interface DailyData {
  date: string;
  minutes: number;
}

interface GenreData {
  name: string;
  value: number;
}

export const UserStats: React.FC = () => {
  const theme = useTheme();
  
  const { data, isLoading } = useQuery<UserStatsData>(
    'userStats',
    async () => {
      const response = await api.analytics.getUserStats();
      return response.data;
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  const dailyData: DailyData[] = data?.daily_stats.map((day) => ({
    date: new Date(day.date).toLocaleDateString(),
    minutes: Math.round(day.total_time / 60)
  })) || [];

  const genreData: GenreData[] = data?.favorite_genres.map(([genre, count]) => ({
    name: genre,
    value: count
  })) || [];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Время просмотра
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Распределение по жанрам
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genreData?.map((_, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom>
            Общее время просмотра
          </Typography>
          <Typography variant="h4">
            {formatDuration(data?.total_watch_time || 0)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom>
            Просмотрено контента
          </Typography>
          <Typography variant="h4">
            {data?.total_content_watched || 0}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom>
            Процент завершения
          </Typography>
          <Typography variant="h4">
            {Math.round((data?.completion_rate || 0) * 100)}%
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
