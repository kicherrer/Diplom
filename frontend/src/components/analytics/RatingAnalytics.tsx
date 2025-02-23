import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { api, RatingAnalytics as RatingAnalyticsType, ApiResponse } from '../../api/client';

interface ChartData {
  rating: number;
  count: number;
}

interface GenreData {
  genre: string;
  averageRating: number;
  count: number;
}

export const RatingAnalytics: React.FC = () => {
  const theme = useTheme();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: response, loading } = useCachedQuery<RatingAnalyticsType>(
    `user-ratings-${userId}`,
    userId ? () => api.ratings.getUserAnalytics(userId.toString()) : null,
    { enabled: !!userId }
  );

  const chartData = response;

  // Validate and transform data before rendering
  const ratingData: ChartData[] = chartData?.ratingDistribution?.map((item: { rating: number; count: number }) => ({
    rating: Number(item.rating),
    count: Number(item.count)
  })) || [];

  const genreData: GenreData[] = chartData?.genreRatings?.map((item: { genre: string; averageRating: number; count: number }) => ({
    genre: item.genre,
    averageRating: Number(item.averageRating),
    count: Number(item.count)
  })) || [];

  if (loading) {
    return <CircularProgress />;
  }

  if (!chartData) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Rating Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Genres Rated
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={genreData}
                  dataKey="averageRating"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {genreData.map((_, index: number) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={theme.palette.primary.main}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Rating Trends
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData.ratingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="averageRating"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};