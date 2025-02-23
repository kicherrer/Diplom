import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { removeNotification, addNotification } from '../store/slices/notificationsSlice';
import type { Notification } from '../store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);

  const addNotif = (notification: Omit<Notification, 'id'>) => {
    dispatch(addNotification(notification));
  };

  const removeNotif = (id: string) => {
    dispatch(removeNotification(id));
  };

  return {
    notifications,
    addNotification: addNotif,
    removeNotification: removeNotif,
  };
};
