import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RatingAnalytics } from '../analytics/RatingAnalytics';
import { ViewingAnalytics } from '../analytics/ViewingAnalytics';

interface UserStatsProps {
  userId: string | undefined;
}

export const UserStats: React.FC<UserStatsProps> = ({ userId }) => {
  const { t } = useTranslation();

  if (!userId) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('profile.stats.ratings')}
            </Typography>
            <RatingAnalytics />
          </Paper>
        </motion.div>
      </Grid>

      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('profile.stats.viewing')}
            </Typography>
            <ViewingAnalytics />
          </Paper>
        </motion.div>
      </Grid>
    </Grid>
  );
};
