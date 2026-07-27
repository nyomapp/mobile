import { COLORS, FONTS } from "@/src/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";

const QR_MAP_ROLE_TITLE = "QRMap";

export default function TabLayout() {
  const { user } = useAuth();
  const showQrTab =
    user?.userType === "main_dealer" ||
    (user?.userType === "user" &&
      user?.roles?.some((r) => r.title === QR_MAP_ROLE_TITLE));

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.primaryBlue,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 3,
          marginTop: 0,
          paddingTop: 3,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.Yellix,
          fontSize: 10,
          fontWeight: "300",
          textAlign: "center",
        },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/hometabfilledicon.png")
                    : require("../../assets/icons/hometabicon.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="deliveries"
        options={{
          title: "Deliveries",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/deliveriestabiconfilled.png")
                    : require("../../assets/icons/deliveriestabicons.png")
                }
                style={{ width: 25, height: 25 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="qr-scan"
        options={{
          title: "QR Scan",
          headerShown: false,
          href: showQrTab ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/qrcodetabfilledicon.png")
                    : require("../../assets/icons/qrcodetabicon.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/searchtabfilledicon.png")
                    : require("../../assets/icons/searchtabicon.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/settingstabfilledicon.png")
                    : require("../../assets/icons/settingstabicon.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
