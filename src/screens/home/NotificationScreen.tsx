import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { FONTS } from "@/src/constants";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationAPI } from "../../api/notification";
import { allStyles } from "../../styles/global";

interface Notification {
  id: string;
  title: string;
  body: string;
  status: 'pending' | 'sent' | 'failed' | 'read';
  type: 'inApp' | 'mobilePush' | 'webPush';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#FFA500';
    case 'sent': return '#2B66DD';
    case 'failed': return '#FF4444';
    case 'read': return '#888888';
    default: return '#2B66DD';
  }
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationAPI.getNotifications();
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const response = await NotificationAPI.deleteNotification(id);
      if (response.success) {
        setNotifications(notifications.filter((notification) => notification.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.status !== 'read') {
      try {
        const response = await NotificationAPI.markAsRead(notification.id);
        if (response.success) {
          setNotifications(notifications.map(n =>
            n.id === notification.id ? { ...n, status: 'read' } : n
          ));
        }
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <ImageBackground
        source={require("@/assets/plainBg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(45,45,231,0)", "rgba(45,45,231,0)"]}
          style={styles.container}
        >
          {/* Header */}
          <View style={allStyles.solidHeader}>
            <View style={allStyles.header}>
              <TouchableOpacity onPress={router.back}>
                <View style={allStyles.btnCircle}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </TouchableOpacity>
              <Text style={allStyles.headerTitle}>Notification</Text>
              <View style={allStyles.headerRight} />
            </View>
          </View>

          <ScrollView contentContainerStyle={allStyles.scrollContent}>
            <View style={allStyles.container}>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[styles.card, { backgroundColor: getStatusColor(notification.status) }]}
                  onPress={() => markAsRead(notification)}
                >
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => removeNotification(notification.id)}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.cardTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.cardDescription}>
                    {notification.body}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(2),
  },
  cardTitle: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.MontserratSemiBold,
    marginBottom: responsiveWidth(1),
  },
  cardDescription: {
    color: "white",
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.MontserratRegular,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 12,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  solidHeader: {
    backgroundColor: "#131465",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 15,
  },
  btnCircle: {
    backgroundColor: "#114B98",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
});
