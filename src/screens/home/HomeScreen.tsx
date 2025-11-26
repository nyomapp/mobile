import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { UsersAPI } from "../../api";
import { Header } from "../../components/common";
import { SoundTouchableOpacity } from "../../components/SoundTouchableOpacity";
import { useAuth } from "../../contexts/AuthContext";
import { dialogStyles, globalStyles, homeStyles } from "../../styles";

import { Ionicons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";

import { COLORS, FONTS } from "@/src/constants";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default function HomeScreen() {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const response = await UsersAPI.getUserById(user.id);
          if (response.success && response.data) {
            const userData = response.data?.data?.user;
            await updateUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user?.id]);

  const profileCompletion = user?.profileCompletion || 0;
  const profileSize = responsiveWidth(36);
  const radius = profileSize * 0.4375; // 35/80 ratio from original
  const center = profileSize / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (profileCompletion / 100) * circumference;

  const [showModal, setShowModal] = useState(false);
  const [showToastDialog, setShowToastDialog] = useState(false);

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <ImageBackground
        source={require("../../../assets/bg.png")}
        style={globalStyles.container}
        resizeMode="cover"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={allStyles.solidHeader}>
            <Header />

            {/* User Profile */}
            <View style={homeStyles.profileSection}>
              <SoundTouchableOpacity
                onPress={() => router.push("/edit-profile")}
              >
                <View style={homeStyles.profileImageContainer}>
                  <View style={{ position: "relative" }}>
                    {/* <Svg width="80" height="80" style={{ position: 'absolute', top: -5, left: -5 }}> */}
                    {/* <Svg width={responsiveWidth(30)} height={responsiveWidth(30)} style={{ position: 'absolute', top: -5, left: -5 }}>
                      <Circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="3"
                        fill="transparent"
                      />
                      <Circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#FFB200"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                      />
                    </Svg> */}
                    <Svg
                      width={profileSize}
                      height={profileSize}
                      style={{ position: "absolute", top: -11, left: -11 }}
                    >
                      {/* Background circle */}
                      <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="3"
                        fill="transparent"
                      />
                      {/* Progress circle */}
                      <Circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="#FFB200"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${center} ${center})`}
                      />
                    </Svg>

                    <Image
                      source={{ uri: user?.avatarUrl }}
                      style={[homeStyles.profileImage, { opacity: 1 }]}
                    />
                  </View>
                  <View style={homeStyles.levelBadge}>
                    <Text style={homeStyles.levelText}>
                      {profileCompletion}%
                    </Text>
                  </View>
                </View>
              </SoundTouchableOpacity>

              <View style={homeStyles.userInfo}>
                <View style={homeStyles.leftInfo}>
                  <Text style={homeStyles.greeting}>
                    Hi{" "}
                    {user?.firstName
                      ? user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1).toLowerCase()
                      : "User"}
                  </Text>
                  <View style={homeStyles.onlineIndicator} />
                </View>
                <Text style={homeStyles.level}>
                  LV. {user?.level?.solo || 0}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={homeStyles.progressContainer}>
              <View style={homeStyles.progressBar}>
                <View
                  style={[
                    homeStyles.progressFill,
                    { width: `${user?.level?.solo || 0}%` },
                  ]}
                />
              </View>
            </View>

            {/* Stats */}
            <View style={homeStyles.statsContainer}>
              <View style={homeStyles.statItem}>
                <Text style={homeStyles.statNumber}>
                  {user?.totalMatches || 0}
                </Text>
                <Text style={homeStyles.statLabel}>Matches</Text>
              </View>
              <View style={homeStyles.statItem}>
                <Text style={homeStyles.statNumber}>
                  {user?.totalWins || 0}
                </Text>
                <Text style={homeStyles.statLabel}>Wins</Text>
              </View>
              <View style={homeStyles.statItem}>
                <Text style={homeStyles.statNumber}>{user?.streak || 0}</Text>
                <Text style={homeStyles.statLabel}>Streaks</Text>
              </View>
            </View>

            {/* Your  battles */}
            <View>
              {/* <Text
                style={{
                  color: "#fff",
                  fontSize: responsiveFontSize(1.4),
                  fontFamily: FONTS.MontserratSemiBold,
                  textAlign: "center",
                  marginTop: responsiveWidth(1),
                }}
              >
                Your battle with Harsh starts in <Text style={{color: "#2ECC71"}}>04:30</Text> hrs
              </Text> */}
            </View>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <View style={homeStyles.yourBattle}>
                <Text style={homeStyles.battleText}>
                  Your battles{" "}
                  <Ionicons
                    name="chevron-forward"
                    size={responsiveWidth(4)}
                    color="#10EE4B"
                  />
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Characters */}
          <View style={homeStyles.charactersContainer}>
            <Image
              source={require("../../../assets/characters/group_avatar1.png")}
              // style={{ width: 339, height: 212 }}
              style={homeStyles.characterImage}
            />
          </View>

          {/* Choose Battle Button */}
          <SoundTouchableOpacity
            style={homeStyles.battleButton}
            onPress={() => router.push("/battle-arena")}
          >
            <ImageBackground
              source={require("../../../assets/buttonBg.png")}
              style={globalStyles.buttonBg}
              resizeMode="contain"
            >
              <Text style={homeStyles.battleButtonText}>Choose a Battle</Text>
            </ImageBackground>
          </SoundTouchableOpacity>
        </ScrollView>

        {/* Modal */}
        {showModal && (
          <View style={styles.dialogOverlay}>
            <View style={dialogStyles.dialogContainer}>
              <View style={styles.dialogBox}>
                {/* Title */}
                <Text style={styles.title}>All Battle</Text>

                {/* PvP Battle */}
                <Text style={styles.sectionTitle}>PvP Battle</Text>
                <View style={styles.pvpCard}>
                  <Image
                    source={{ uri: user?.avatarUrl }}
                    style={styles.avatar}
                  />
                  <Text style={styles.pvpText}>Swapnil invited you.</Text>

                  <View style={styles.actionBtns}>
                    <TouchableOpacity style={styles.acceptBtn}>
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.denyBtn}>
                      <Text style={styles.denyText}>Deny</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Group Battle */}
                <Text style={styles.sectionTitle}>Group Battle</Text>
                <View style={styles.battleCard}>
                  <Text style={styles.battleText}>
                    Your battle with GT starts in{" "}
                    <Text style={styles.timeText}>05:45</Text> hrs
                  </Text>
                </View>

                {/* Team Battle */}
                <Text style={styles.sectionTitle}>Team Battle</Text>
                <View style={styles.battleCard}>
                  <Text style={styles.battleText}>
                    Your battle with Harsh starts in{" "}
                    <Text style={styles.timeText}>04:30</Text> hrs
                  </Text>
                </View>

                {/* Notification message */}
                <Text style={styles.notifyMsg}>
                  You’ll be notified 15 min prior battle starts.
                </Text>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Toast Dailog Box */}
        {showToastDialog && (
          <View
            style={[dialogStyles.dialogOverlay, { justifyContent: "center" }]}
          >
            <View style={dialogStyles.dialogContainer}>
              <View
                style={[
                  dialogStyles.dialogContent,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Image
                  source={{ uri: user?.avatarUrl }}
                  style={styles.profileImage}
                />
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    fontFamily: FONTS.MontserratSemiBold,
                    marginTop: responsiveWidth(2),
                  }}
                >
                  You received a friend request
                </Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: FONTS.MontserratSemiBold,
                  }}
                >
                  Harsh wants you to become his friend.
                </Text>
              </View>
              <View style={dialogStyles.dialogButtons}>
                <SoundTouchableOpacity
                  style={dialogStyles.cancelButton}
                  onPress={() => setShowToastDialog(false)}
                >
                  <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                </SoundTouchableOpacity>
                <SoundTouchableOpacity
                  style={dialogStyles.okButton}
                  onPress={() => setShowToastDialog(false)}
                >
                  <Text style={dialogStyles.okButtonText}>Accept</Text>
                </SoundTouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Custom Toast */}
        {/* <TouchableOpacity
          style={styles.toastBox}
          onPress={() => setShowToastDialog(true)}
        >
          <Image source={{ uri: user?.avatarUrl }} style={styles.toastImage} />
          <Text style={styles.toastText}>
            Harsh wants you to become his friend.
          </Text>
          <Ionicons
            name="close"
            size={responsiveWidth(5)}
            color={COLORS.primary}
          />
        </TouchableOpacity> */}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // overlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(0,0,0,0.4)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },

  toastBox: {
    borderBottomWidth: responsiveWidth(1),
    borderColor: "#2ECC71",
    borderRadius: responsiveWidth(1),
    padding: responsiveWidth(1),
    backgroundColor: "#E8E8FF",
    margin: responsiveWidth(2),
    position: "absolute",
    top: 0,
    zIndex: 1000,
    width: responsiveWidth(96),
    flexDirection: "row",
    alignItems: "center",
  },

  toastImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    // borderRadius: 25,
    marginRight: responsiveWidth(2),
    backgroundColor: "#4C7CBE",
    borderRadius: responsiveWidth(100),
  },
  toastText: {
    flex: 1,
    fontFamily: FONTS.MontserratSemiBold,
    fontSize: responsiveFontSize(1.8),
    color: COLORS.primary,
  },

  //   toastBox: {
  //   position: "absolute",
  //   top: 60,
  //   left: "5%",
  //   right: "5%",
  //   backgroundColor: COLORS.white,
  //   borderRadius: 30,
  //   padding: 20,
  //   width: "90%",
  //   maxHeight: "80%",
  //   zIndex: 1000,
  // },

  dialogOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center", // flex-end se center
    alignItems: "center",
  },

  dialogBox: {
    width: responsiveWidth(90),
    backgroundColor: "#fff",
    borderRadius: responsiveWidth(8),
    // paddingVertical: 25,
    // paddingHorizontal: 20,
    padding: responsiveWidth(4),
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    textAlign: "center",
    marginBottom: 20,
    fontFamily: FONTS.MontserratSemiBold,
    color: "#0B1A43",
  },
  sectionTitle: {
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(1),
    color: "#0B1A43",
    fontFamily: FONTS.MontserratSemiBold,
  },
  pvpCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2ECC71",
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(2),
    backgroundColor: "#E8E8FF",
  },
  avatar: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(100),
    marginRight: responsiveWidth(2),
    backgroundColor: "#4C7CBE",
  },
  pvpText: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold,
    color: "#0B1A43",
  },
  actionBtns: {
    flexDirection: "row",
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: "#2ECC71",
    paddingVertical: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(100),
  },
  denyBtn: {
    backgroundColor: "#FF6B6B",
    paddingVertical: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(100),
  },
  acceptText: {
    color: "#fff",
    fontFamily: FONTS.MontserratSemiBold,
    fontSize: responsiveFontSize(1.5),
  },
  denyText: {
    color: "#fff",
    fontFamily: FONTS.MontserratSemiBold,
    fontSize: responsiveFontSize(1.5),
  },
  battleCard: {
    borderWidth: 2,
    borderColor: "#2ECC71",
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(2),
    backgroundColor: "#E8E8FF",
  },
  battleText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold,
    color: "#0B1A43",
  },
  timeText: {
    color: "#2ECC71",
    fontFamily: FONTS.MontserratSemiBold,
    fontSize: responsiveFontSize(1.8),
  },
  notifyMsg: {
    textAlign: "center",
    marginVertical: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
    color: "#0B1A43",
    fontFamily: FONTS.MontserratSemiBold,
  },
  closeBtn: {
    paddingVertical: responsiveWidth(2),
    borderTopWidth: 1,
    borderColor: COLORS.primary,
    marginTop: responsiveWidth(2),
  },
  closeText: {
    textAlign: "center",
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold,
    color: COLORS.primary,
    marginTop: responsiveWidth(2),
  },
  profileImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(100),
    backgroundColor: "#4C7CBE",
    marginBottom: responsiveWidth(6),
  },
});
