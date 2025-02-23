import React, { useState } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/client';
import { useDebounce, useCachedQuery } from '../../hooks';

export const FriendSearch: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      try {
        const response = await api.users.searchUsers(debouncedQuery);
        setResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  const handleSendRequest = async (userId: string) => {
    try {
      await api.users.sendFriendRequest(userId);
      // Update UI to show request sent
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        fullWidth
        label={t('social.searchUsers')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <List>
              {results.map((user) => (
                <ListItem
                  key={user.id}
                  secondaryAction={
                    <Button
                      startIcon={<PersonAdd />}
                      onClick={() => handleSendRequest(user.id)}
                      variant="outlined"
                      size="small"
                    >
                      {t('social.addFriend')}
                    </Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={user.avatar || undefined} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={`${user.shared_interests} ${t('social.sharedInterests')}`}
                  />
                </ListItem>
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};
