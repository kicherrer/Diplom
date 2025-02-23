import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationActionType = 'chat' | 'content' | 'friend' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  actionType: NotificationActionType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
  image?: string;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  type?: NotificationType;
  actionType?: NotificationActionType;
  read?: boolean;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  filters: NotificationFilters;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  filters: {}
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false
      };
      state.items.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        if (!item.read) {
          item.read = true;
        }
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount -= 1;
        }
        state.items.splice(index, 1);
      }
    },
    setFilters: (state, action: PayloadAction<NotificationFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    }
  }
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setFilters,
  clearFilters
} = notificationSlice.actions;

export default notificationSlice.reducer;
