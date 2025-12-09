import { COLORS, FONTS } from "@/src/constants";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.primaryBlue,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          marginTop: 0,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.Yellix,
          fontSize: 10,
          fontWeight: "300",
        },
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
            <View style={{}}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/HometabFilledIcon.png")
                    : require("../../assets/icons/HomeTabIcon.png")
                }
                style={{
                  width: 25,
                  height: 25,
                  // tintColor: focused ? COLORS.primaryBlue : "#666",
                }}
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
            <View style={{}}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/deliveriesTabIconFilled.png")
                    : require("../../assets/icons/deliveriesTabIcons.png")
                }
                style={{
                  width: 25,
                  height: 25,
                  // tintColor: focused ? COLORS.primaryBlue : "#666",
                }}
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
            <View style={{}}>
              <Image
                source={
                  focused
                    ? require("../../assets/icons/SearchTabFilledIcon.png")
                    : require("../../assets/icons/searchTabIcon.png")
                }
                style={{
                  width: 25,
                  height: 25,
                  // tintColor: focused ? COLORS.primaryBlue : "#666",
                }}
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
            <View
              style={
                {
                  // backgroundColor: focused ? "#fff" : "#fff",
                }
              }
            >
              <Image
                source={
                  focused
                    ? require("../../assets/icons/SettingsTabFilledIcon.png")
                    : require("../../assets/icons/settingsTabIcon.png")
                }
                style={{
                  width: 25,
                  height: 25,
                  // tintColor: focused ? COLORS.primaryBlue : "#666",
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
