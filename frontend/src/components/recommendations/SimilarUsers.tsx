import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { api, SimilarUser } from '../../api/client';

export const SimilarUsers: React.FC = () => {
  const theme = useTheme();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: response } = useCachedQuery<SimilarUser[]>(
    `similar-users-${userId}`,
    userId ? () => api.users.getSimilarUsers(userId.toString()) : null,
    { enabled: !!userId }
  );

  const similarUsers = response || [];

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Users with Similar Taste
      </Typography>
      <List>
        {similarUsers.map((user: SimilarUser) => (
          <ListItem
            key={user.id}
            sx={{
              mb: 1,
              borderRadius: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar src={user.avatar_url} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  {user.common_genres.slice(0, 3).map((genre: string) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                  ))}
                </Box>
              }
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ ml: 2 }}
            >
              {user.similarity_score}% Match
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
