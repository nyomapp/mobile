import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SoundTouchableOpacity } from "../../components/SoundTouchableOpacity";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts";
import { globalStyles } from "../../styles";
import { allStyles } from "../../styles/global";
import { profileStyles } from "../../styles/profileStyles";

export default function ProfileScreen() {
  const { user } = useAuth();

  const achievements = [
    { icon: "Super_Streak_Star.png", title: "Super Streak Star" },
    { icon: "Cash_King.png", title: "Cash King" },
    { icon: "Solo_Silent_Op.png", title: "Solo Silent Op" },
    { icon: "Sturdy_Earner.png", title: "Sturdy Earner" },
  ];

  const badgeImages: { [key: string]: any } = {
    "Super_Streak_Star.png": require("../../../assets/badges/Super_Streak_Star.png"),
    "Cash_King.png": require("../../../assets/badges/Cash_King.png"),
    "Solo_Silent_Op.png": require("../../../assets/badges/Solo_Silent_Op.png"),
    "Sturdy_Earner.png": require("../../../assets/badges/Sturdy_Earner.png"),
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <ImageBackground
        source={require("../../../assets/plainBg.png")}
        style={globalStyles.container}
        resizeMode="cover"
      >
        

          {/* Header */}
          <View style={allStyles.solidHeader}>
            <View style={allStyles.header}>
              <SoundTouchableOpacity onPress={router.back}>
                <View style={allStyles.btnCircle}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </SoundTouchableOpacity>
              <Text style={allStyles.headerTitle}>My Profile</Text>
              <View style={allStyles.headerRight}>
                <SoundTouchableOpacity
                style={allStyles.iconButton}
                onPress={() => router.push("/notification")}
              >
                <Image
                  source={require("../../../assets/icons/notification.png")}
                  style={allStyles.headerRightIcon}
                />
              </SoundTouchableOpacity>
              <SoundTouchableOpacity
                style={allStyles.iconButton}
                onPress={() => router.push("/settings")}
              >
                <Image
                  source={require("../../../assets/icons/settings.png")}
                  style={allStyles.headerRightIcon}
                />
              </SoundTouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={allStyles.scrollContent}>
            <View style={allStyles.container}>
              <View style={profileStyles.profileSection}>
                <View style={profileStyles.avatarWrapper}>
                  <View style={profileStyles.progressCircle}>
                    <Image
                      source={
                        user?.avatarUrl
                          ? { uri: user.avatarUrl }
                          : require("../../../assets/characters/avatar2.png")
                      }
                      style={profileStyles.profileImage}
                    />
                  </View>
                </View>
                <View>
                  <Text style={profileStyles.profileName}>
                    {user
                      ? `${user.firstName || ""} ${
                          user.lastName || ""
                        }`.trim() || "User"
                      : "Loading..."}
                  </Text>
                  <View style={profileStyles.levelContainer}>
                    <Text style={profileStyles.levelText}>
                      LV. {user?.level?.solo || 1}
                    </Text>
                    <Text style={profileStyles.memberSince}>
                      Member since{" "}
                      <Text style={profileStyles.memberSinceDate}>
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Aug.14,2024"}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={profileStyles.statsContainer}>
                <View style={profileStyles.statCard}>
                  <Text style={profileStyles.statLabel}>Earned</Text>
                  <View style={profileStyles.statAmount}>
                    <Image
                      source={require("../../../assets/icons/coin.png")}
                      style={{ width: 14, height: 14 }}
                    />
                    <Text style={profileStyles.statValue}>
                      {formatNumber(user?.earnedCoins || 0)}
                    </Text>
                  </View>
                  {/* <Text style={profileStyles.statPercentage}>+4.5%</Text> */}
                </View>
                <View style={profileStyles.statCard}>
                  <Text style={profileStyles.statLabel}>Spent</Text>
                  <View style={profileStyles.statAmount}>
                    <Image
                      source={require("../../../assets/icons/coin.png")}
                      style={{ width: 14, height: 14 }}
                    />
                    <Text style={profileStyles.statValue}>
                      {formatNumber(user?.spentCoins || 0)}
                    </Text>
                  </View>
                  {/* <Text style={profileStyles.statPercentageNegative}>-50%</Text> */}
                </View>
              </View>

              <View style={profileStyles.section}>
                <Text style={allStyles.sectionTitle}>
                  Your Game Statistics
                </Text>
                <View style={profileStyles.gameStatsContainer}>
                  <View style={profileStyles.gameStatItem}>
                    <Text style={profileStyles.gameStatNumber}>
                      {user?.totalMatches || 0}
                    </Text>
                    <Text style={profileStyles.gameStatLabel}>Matches</Text>
                  </View>
                  <View style={profileStyles.gameStatItem}>
                    <Text style={profileStyles.gameStatNumber}>
                      {user?.totalWins || 0}
                    </Text>
                    <Text style={profileStyles.gameStatLabel}>Wins</Text>
                  </View>
                  <View
                    style={[
                      profileStyles.gameStatItem,
                      profileStyles.lastGameStatItem,
                    ]}
                  >
                    <Text style={profileStyles.gameStatNumber}>
                      {user?.streak || 0}
                    </Text>
                    <Text style={profileStyles.gameStatLabel}>Streaks</Text>
                  </View>
                </View>
              </View>

              <View style={profileStyles.section}>
                <Text style={allStyles.sectionTitle}>
                  Your Achievements & Badges
                </Text>
                <View style={profileStyles.achievementsContainer}>
                  {achievements.map((achievement, index) => (
                    <View key={index} style={profileStyles.achievementItem}>
                      <View style={profileStyles.achievementIcon}>
                        {badgeImages[achievement.icon] ? (
                          <Image
                            source={badgeImages[achievement.icon]}
                            // style={{ width: 48, height: 58 }}
                            style={profileStyles.achievementBadge}
                          />
                        ) : (
                          <Text style={profileStyles.achievementEmoji}>
                            {achievement.icon}
                          </Text>
                        )}
                      </View>
                      <Text style={profileStyles.achievementTitle}>
                        {achievement.title}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        
      </ImageBackground>
    </SafeAreaView>
  );
}
