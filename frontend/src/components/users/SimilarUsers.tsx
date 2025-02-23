import React from 'react';
import { Grid, Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import { useCachedQuery } from '../../hooks';
import { SimilarUser, ApiResponse, api } from '../../api/client';
import { useTranslation } from 'react-i18next';

interface SimilarUsersProps {
  userId: string;
}

export const SimilarUsers: React.FC<SimilarUsersProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { data: similarUsers } = useCachedQuery<SimilarUser[]>(
    `similar-users-${userId}`,
    userId ? () => api.users.getSimilarUsers(userId) : null,
    { enabled: !!userId }
  );

  if (!similarUsers?.length) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {similarUsers.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={user.avatar_url} />
                <Box>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('users.similarityScore', { score: Math.round(user.similarity_score * 100) })}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
