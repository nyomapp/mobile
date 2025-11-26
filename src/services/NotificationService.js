import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";
import { TokenStorage } from "../api";
import { NotificationAPI } from "../api/notification";
import * as Application from "expo-application";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialize() {
    try {
      if (!Device.isDevice) {
        console.log("Push notifications only work on physical devices");
        return false;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission denied");
        return false;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;
      console.log("Expo Push Token:", token.data);

      await this.registerWithBackend(token.data);
      this.setupListeners();

      return true;
    } catch (error) {
      console.error("Error initializing notifications:", error);
      return false;
    }
  }

  async registerWithBackend(token) {
    try {
      const user = await TokenStorage.getUser();
      const authToken = await TokenStorage.getToken();

      if (!authToken || !user) {
        console.error("No auth token or user found");
        return;
      }

      const deviceName = await Device.deviceName || 'Unknown Device';
      const appVersion = Application.nativeApplicationVersion || '1.0.0';

      const response = await NotificationAPI.registerDevice({
        deviceToken: token,
        platform: Platform.OS,
        deviceName: deviceName,
        appVersion: appVersion,
      });

      if (response.success) {
        console.log("Device registered for notifications");
      } else {
        console.error("Failed to register device:", response.error);
      }
    } catch (error) {
      console.error("Error registering device:", error);
    }
  }

  setupListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        const data = notification.request.content.data;
        this.handleNotificationData(data);
      }
    );

    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
        const data = response.notification.request.content.data;
        this.handleNotificationTap(data);
      });
  }

  handleNotificationData(data) {
    console.log("Handling notification data:", data);
  }

  handleNotificationTap(data) {
    if (data?.type === "survey") {
      router.push("/surveys");
    } else if (data?.type === "reward") {
      router.push("/rewards");
    } else if (data?.type === "profile") {
      router.push("/profile");
    } else {
      router.push("/home");
    }
  }

  async unregister() {
    try {
      const authToken = await TokenStorage.getToken();
      if (!authToken || !this.expoPushToken) return;

      const response = await NotificationAPI.unregisterDevice({
        deviceToken: this.expoPushToken,
      });

      if (response.success) {
        console.log("Device unregistered from notifications");
      } else {
        console.error("Failed to unregister device:", response.error);
      }

      if (this.notificationListener) {
        Notifications.removeNotificationSubscription(this.notificationListener);
      }
      if (this.responseListener) {
        Notifications.removeNotificationSubscription(this.responseListener);
      }

      this.expoPushToken = null;
    } catch (error) {
      console.error("Error unregistering device:", error);
    }
  }

  getToken() {
    return this.expoPushToken;
  }

  async isEnabled() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  }
}

export const notificationService = new NotificationService();
