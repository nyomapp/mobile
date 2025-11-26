import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 100,
          // paddingBottom: 0,
          marginTop: 0,
          paddingTop: 20,
        },
        tabBarLabelStyle: {
          fontFamily: "MontserratRegular",
          fontSize: 12,
          color: "#A2A2A2",
        },
        tabBarActiveTintColor: "#00bfff",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#1da1fa" : "#fff",
                borderRadius: 31,
                width: 42,
                height: 42,
                justifyContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                // borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 20,
              }}
            >
              <Image
                source={require("../../assets/icons/team.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#fff" : "#A2A2A2",
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#1da1fa" : "#fff",
                borderRadius: 31,
                width: 42,
                height: 42,
                justifyContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                // borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 20,
              }}
            >
              <Image
                source={require("../../assets/icons/users.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#fff" : "#A2A2A2",
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#1da1fa" : "#A2A2A2",
                borderRadius: 40,
                width: 70,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 40,
              }}
            >
              <Image
                source={require("../../assets/icons/home.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#fff" : "#fff",
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#1da1fa" : "#fff",
                borderRadius: 31,
                width: 42,
                height: 42,
                justifyContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                // borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 20,
              }}
            >
              <Image
                source={require("../../assets/icons/profile.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#fff" : "#666",
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#1da1fa" : "#fff",
                borderRadius: 31,
                width: 42,
                height: 42,
                justifyContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                // borderWidth: 4,
                borderColor: "#fff",
                marginBottom: 20,
              }}
            >
              <Image
                source={require("../../assets/icons/wallet.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#fff" : "#666",
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
