import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: []
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const timestamp = Date.now();
      const id = `${timestamp}-${Math.random().toString(36).substring(7)}`;
      
      state.items.push({
        ...action.payload,
        id,
        timestamp
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item: Notification) => item.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    }
  }
});

export const { addNotification, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
