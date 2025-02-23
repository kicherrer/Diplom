import React from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { useSelector } from 'react-redux';
import { api, ViewingStats } from '../../api/client';
import { RootState } from '../../store';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const ViewingAnalytics: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: viewingStats } = useCachedQuery<ViewingStats>(
    `viewing-stats-${userId}`,
    userId ? () => api.users.getViewingStats(userId.toString()) : null,
    { enabled: !!userId }
  );

  if (!viewingStats || !userId) {
    return <Typography>No viewing data available</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Viewing Activity Over Time
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer>
              <LineChart data={viewingStats?.dailyActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#8884d8"
                  name="Minutes Watched"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Watch Time
                </Typography>
                <Typography variant="h3">
                  {Math.round((viewingStats?.totalWatchTime || 0) / 60)} hrs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Most Active Time
                </Typography>
                <Typography variant="h4">
                  {viewingStats?.mostActiveTime || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Genre Distribution
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer>
              <BarChart data={viewingStats?.genreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="genre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Watched Count" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
