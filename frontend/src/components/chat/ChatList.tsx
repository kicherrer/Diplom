import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useCachedQuery } from '../../hooks';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { api } from '../../api/client';
import { AxiosResponse } from 'axios';

interface ChatRoom {
  id: number;  // Changed from string to number
  participants: Array<{
    id: number;  // Changed from string to number
    username: string;
    avatar: string | null;
  }>;
  last_message: {
    content: string;
    timestamp: string;
    sender_id: number;  // Changed from string to number
  } | null;
  unread_count: number;
}

import { User } from '../../types/auth';

interface ChatListProps {
  onRoomSelect: (roomId: number) => void;  // Changed from string to number
  selectedRoomId?: number;  // Changed from string to number
}

export const ChatList: React.FC<ChatListProps> = ({ onRoomSelect, selectedRoomId }): JSX.Element => {
  const { t } = useTranslation();
  const currentUser = useSelector((state: RootState) => state.auth.user as User);
  const { data: rooms } = useCachedQuery<ChatRoom[]>('chat-rooms', () => api.chat.getRooms());

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {Array.isArray(rooms) && rooms.map((room) => {
        const otherParticipant = room.participants.find((p) => p.id !== currentUser?.id);
        
        return (
          <motion.div
            key={room.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem
              button
              selected={selectedRoomId === room.id}
              onClick={() => onRoomSelect(room.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                }
              }}
            >
              <ListItemAvatar>
                <Badge
                  badgeContent={room.unread_count}
                  color="primary"
                  invisible={!room.unread_count}
                >
                  <Avatar src={otherParticipant?.avatar || undefined} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={otherParticipant?.username}
                secondary={
                  room.last_message && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: 150 }}
                    >
                      {room.last_message.content}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ ml: 1, opacity: 0.7 }}
                      >
                        · {format(new Date(room.last_message.timestamp), 'HH:mm')}
                      </Typography>
                    </Typography>
                  )
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </motion.div>
        );
      })}
    </List>
  );
};
