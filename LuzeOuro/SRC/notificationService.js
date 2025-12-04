import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== "granted") {
    return null;
  }

  return await Notifications.getExpoPushTokenAsync();
}

export async function enviarNotificacao(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
}