import * as Notifications from 'expo-notifications';
import { useNotificationStore } from '@/stores/notificationStore';
import { apiPost } from '@/services/apiClient';

export function useNotifications() {
  const { notifications, unreadCount, pushToken, addNotification, markAsRead, markAllAsRead, setPushToken } = useNotificationStore();

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    setPushToken(token);
    await apiPost('/notifications/register-token', { token });
  };

  return { notifications, unreadCount, pushToken, registerForPushNotifications, markAsRead, markAllAsRead };
}
