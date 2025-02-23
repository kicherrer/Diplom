import React from 'react';
import { Grid, Paper, Box, Typography, Avatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ProfileTabs } from './ProfileTabs';
import { LevelProgress } from './LevelProgress';

export const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={user?.avatar}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5">{user?.username}</Typography>
                <Typography color="text.secondary">{user?.bio}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Additional user info here */}
              <Box sx={{ mt: 2 }}>
                <LevelProgress
                  level={user?.level?.current_level || 1}
                  currentExp={user?.level?.current_exp || 0}
                  expToNext={user?.level?.exp_to_next_level || 1000}
                  totalExp={user?.level?.total_exp || 0}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <ProfileTabs userId={user.id} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
