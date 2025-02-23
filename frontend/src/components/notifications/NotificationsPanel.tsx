import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  Close,
  Chat,
  Movie,
  Person,
  Settings,
  NotificationsOff,
  CheckCircle
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  markAllAsRead,
  markAsRead,
  removeNotification,
  Notification
} from '../../store/slices/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const getNotificationIcon = (actionType: Notification['actionType']) => {
  switch (actionType) {
    case 'chat':
      return <Chat />;
    case 'content':
      return <Movie />;
    case 'friend':
      return <Person />;
    case 'system':
      return <Settings />;
    default:
      return <NotificationsOff />;
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  open,
  onClose
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const filters = useSelector((state: RootState) => state.notifications.filters);
  const unreadCount = useSelector((state: RootState) => state.notifications.unreadCount);

  const handleNotificationClick = (notification: Notification) => {
    dispatch(markAsRead(notification.id));
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.actionType && notification.actionType !== filters.actionType) return false;
    if (filters.read !== undefined && notification.read !== filters.read) return false;
    return true;
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Notifications
          {unreadCount > 0 && (
            <Badge
              badgeContent={unreadCount}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {unreadCount > 0 && (
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            onClick={() => dispatch(markAllAsRead())}
            startIcon={<CheckCircle />}
          >
            Mark all as read
          </Button>
        </Box>
      )}

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {filteredNotifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{
                opacity: notification.read ? 0.7 : 1,
                bgcolor: notification.read ? 'transparent' : 'action.hover'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={notification.image}
                  sx={{
                    bgcolor: notification.read ? 'action.disabled' : `${notification.type}.main`
                  }}
                >
                  {getNotificationIcon(notification.actionType)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </Typography>
                  </Box>
                }
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeNotification(notification.id));
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};
