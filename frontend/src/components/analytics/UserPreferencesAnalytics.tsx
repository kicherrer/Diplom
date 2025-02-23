import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { api, PreferenceAnalytics } from '../../api/client';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface GenrePreference {
  genre: string;
  score: number;
}

interface Props {
  userId: string;
}

export const UserPreferencesAnalytics: React.FC<Props> = ({ userId }) => {
  const [preferences, setPreferences] = React.useState<PreferenceAnalytics | null>(null);

  React.useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await api.users.getPreferenceAnalytics(userId);
        setPreferences(response.data.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [userId]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Content Preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={preferences?.genrePreferences || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="genre" />
                <Radar
                  name="Genre Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Viewing History Insights
          </Typography>
          {/* Add more analytics components here */}
        </Grid>
      </Grid>
    </Paper>
  );
};
