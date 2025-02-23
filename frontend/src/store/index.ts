import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './slices/notificationSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
