import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { PersonAdd, Check, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/client';
import { useCachedQuery } from '../../hooks/useCachedQuery';

export const FriendsList: React.FC = () => {
  const { t } = useTranslation();
  const { data: response } = useCachedQuery('friends', () => api.users.getFriends());
  const { data: requestsResponse } = useCachedQuery('friend-requests', () => 
    api.users.getFriendRequests()
  );

  const friends = response || [];
  const requests = requestsResponse || [];

  const handleAcceptRequest = async (id: number) => {
    await api.users.acceptFriendRequest(id);
    // Invalidate queries to refresh the data
  };

  const handleDeclineRequest = async (id: number) => {
    await api.users.declineFriendRequest(id);
    // Invalidate queries to refresh the data
  };

  return (
    <Box>
      {requests.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            {t('social.friendRequests')}
          </Typography>
          <List>
            <AnimatePresence>
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handleAcceptRequest(request.id)}>
                          <Check color="success" />
                        </IconButton>
                        <IconButton onClick={() => handleDeclineRequest(request.id)}>
                          <Close color="error" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={request.friend_details.avatar || undefined} />
                    </ListItemAvatar>
                    <ListItemText primary={request.friend_details.username} />
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
        </>
      )}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        {t('social.friends')}
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem
            key={friend.id}
            secondaryAction={
              <Chip
                label={t('common.online')}
                color="success"
                size="small"
                variant="outlined"
              />
            }
          >
            <ListItemAvatar>
              <Avatar src={friend.friend_details.avatar || undefined} />
            </ListItemAvatar>
            <ListItemText 
              primary={friend.friend_details.username}
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {friend.friend_details.shared_interests} {t('social.sharedInterests')}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
