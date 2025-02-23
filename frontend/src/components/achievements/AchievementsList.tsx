import React from 'react';
import { Grid } from '@mui/material';
import { AchievementCard } from './AchievementCard';
import { useCachedQuery } from '../../hooks';
import { Achievement, api, ApiResponse } from '../../api/client';

interface AchievementsListProps {
  userId: string | undefined;
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ userId }) => {
  const { data: achievements } = useCachedQuery<Achievement[]>(
    `achievements-${userId}`,
    userId ? () => api.users.getAchievements(userId) : null,
    { enabled: !!userId }
  );

  if (!achievements?.length) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {achievements.map((achievement: Achievement) => (
        <Grid item xs={12} sm={6} key={achievement.id}>
          <AchievementCard achievement={achievement} />
        </Grid>
      ))}
    </Grid>
  );
};
