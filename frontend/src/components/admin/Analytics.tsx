import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AdminAnalytics, api } from '../../api/client';

export const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.admin.getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const viewsData = [
    { date: '2023-01', movies: 4000, series: 2400, videos: 1800 },
    { date: '2023-02', movies: 3000, series: 1398, videos: 2210 },
    { date: '2023-03', movies: 2000, series: 9800, videos: 2290 },
    { date: '2023-04', movies: 2780, series: 3908, videos: 2000 },
  ];

  const genreData = [
    { name: 'Action', value: 400 },
    { name: 'Drama', value: 300 },
    { name: 'Comedy', value: 300 },
    { name: 'Horror', value: 200 },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Content Views Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="movies" stroke="#8884d8" />
                <Line type="monotone" dataKey="series" stroke="#82ca9d" />
                <Line type="monotone" dataKey="videos" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Popular Genres
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {/* Add user activity metrics here */}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
