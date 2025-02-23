import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { api } from '../../api/client';

interface WatchHistoryProps {
  userId: string | undefined;
}

interface WatchHistoryResponse {
  data: Array<{ id: string; title: string; watched_at: string }>;
}

export const WatchHistory: React.FC<WatchHistoryProps> = ({ userId }) => {
  const { data: response } = useCachedQuery<WatchHistoryResponse>(
    `watch-history-${userId}`,
    userId ? () => api.users.getWatchHistory(userId) : null,
    { enabled: !!userId }
  );

  const history = response?.data || [];

  return (
    <Box>
      <List>
        {history.map((item: any) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={item.title}
              secondary={new Date(item.watched_at).toLocaleDateString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
