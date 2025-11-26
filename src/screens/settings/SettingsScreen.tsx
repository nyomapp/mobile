import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SetupAPI, TokenStorage, UsersAPI } from "../../api";
import type { Country } from "../../api/types";
import { useAuth } from "../../contexts/AuthContext";
import { dialogStyles, globalStyles, settingsStyles } from "../../styles";

import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";

import { SoundTouchableOpacity } from "../../components/SoundTouchableOpacity";
import { soundManager } from "../../utils/SoundUtils";

export default function SettingsScreen() {
  const { user, updateUser } = useAuth();
  const [audioEnabled, setAudioEnabled] = useState(
    user?.preferences?.audio ?? true
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    (user?.preferences?.notifications?.mobile &&
      user?.preferences?.notifications?.inApp) ??
    true
  );
  const [showLogout, setShowLogout] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState("English");
  const [countries, setCountries] = useState<Country[]>([]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const languageOptions = [
    "Japanese",
    "Hindi",
    "English",
    "British English",
    "Chinese",
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await SetupAPI.getCountries();

        if (response.success && response.data && Array.isArray(response.data)) {
          setCountries(response.data);
          // Use user's country if available, otherwise default to US
          const userCountryCode = user?.country || "US";
          const defaultCountry = response.data.find((c) => c.code === userCountryCode);
          if (defaultCountry) {
            setSelectedCountry(defaultCountry);
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, [user?.country]);

  const updateUserPreferences = async (updates: any) => {
    try {
      const currentUser = await TokenStorage.getUser();
      if (!currentUser) return;

      const updateData = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...updates,
        },
      };

      const response = await UsersAPI.updateUser(currentUser.id, updateData);
      if (response.success && response.data) {
        const responseData = response.data?.data?.user;
        await TokenStorage.setUser(responseData);
        await updateUser(responseData);
      }
    } catch (error) {
      console.error("Update preferences error:", error);
    }
  };

  const handleCancel = () => {
    setShowLogout(false);
  };

  const handleLanguageOK = () => {
    setSelectedLanguage(tempSelectedLanguage);
    updateUserPreferences({ language: tempSelectedLanguage });
    setShowLanguageDialog(false);
  };

  const handleLanguageSelect = (language: any) => {
    setTempSelectedLanguage(language);
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return "User";
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <ImageBackground
        source={require("../../../assets/plainBg.png")}
        style={globalStyles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(45,45,231,0)", "rgba(45,45,231,0)"]}
          style={globalStyles.container}
        >
          {/* Header */}
          <View style={allStyles.solidHeader}>
            <View style={allStyles.header}>
              <SoundTouchableOpacity
                onPress={() => router.push("/(tabs)/home")}
              >
                <View style={allStyles.btnCircle}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </SoundTouchableOpacity>
              <Text style={allStyles.headerTitle}>Settings</Text>
              <View style={allStyles.headerRight} />
            </View>
          </View>

          <ScrollView contentContainerStyle={allStyles.scrollContent}>
            <View style={allStyles.container}>
              <SoundTouchableOpacity
                style={settingsStyles.profileSection}
                onPress={() => router.push("/edit-profile")}
              >
                <Image
                  source={{ uri: user?.avatarUrl }}
                  style={settingsStyles.profileImage}
                />
                <View style={settingsStyles.profileInfo}>
                  <Text style={settingsStyles.profileName}>
                    {getUserDisplayName()}
                  </Text>
                  <Text style={settingsStyles.profileLevel}>
                    LV. {user?.level?.solo}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  style={settingsStyles.forwardIcon}
                />
              </SoundTouchableOpacity>

              {/* Rest of the component remains the same */}

              <View style={settingsStyles.settingsGroup}>
                <View style={settingsStyles.settingItem}>
                  <View style={settingsStyles.settingLeft}>
                    {/* <Image
                      source={require("@/assets/icons/audio.png")}
                    /> */}
                    <Image
                      source={
                        audioEnabled
                          ? require("@/assets/icons/audio_on.png")
                          : require("@/assets/icons/audio_off.png")
                      } style={style.icon}
                    />

                    <Text style={settingsStyles.settingText}>Audio</Text>
                  </View>
                  <Switch
                    value={audioEnabled}
                    onValueChange={(value) => {
                      setAudioEnabled(value);
                      soundManager.setAudioEnabled(value);
                      updateUserPreferences({ audio: value });
                    }}
                    trackColor={{ false: "#8095AF", true: "#2F73AF" }}
                    thumbColor={audioEnabled ? "#ffffff" : "#f4f3f4"}
                  />
                </View>

                <View style={settingsStyles.settingItem}>
                  <View style={settingsStyles.settingLeft}>
                    <Image
                      source={
                        notificationsEnabled
                          ? require("../../../assets/icons/on_notification.png")
                          : require("../../../assets/icons/pause_notification.png")
                      } style={style.icon}
                    />
                    <Text style={settingsStyles.settingText}>
                      Pause Notifications
                    </Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={(value) => {
                      setNotificationsEnabled(value);
                      updateUserPreferences({
                        notifications: {
                          email: value,
                          web: value,
                          sms: value,
                          mobile: value,
                          inApp: value,
                        },
                      });
                    }}
                    trackColor={{ false: "#8095AF", true: "#2F73AF" }}
                    thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
                  />
                </View>
                <View style={[settingsStyles.settingItem]}>
                  <View style={settingsStyles.settingLeft}>
                    <Image
                      source={require("@/assets/icons/language.png")} style={style.icon}
                    />
                    <Text style={settingsStyles.settingText}>Country</Text>
                  </View>
                  <Text style={settingsStyles.settingValue}>
                    {selectedCountry?.name || 'Select Country'}
                  </Text>
                </View>
                <SoundTouchableOpacity style={settingsStyles.settingItem}>
                  <View style={settingsStyles.settingLeft}>
                    <Image
                      source={require("@/assets/icons/language.png")} style={style.icon}
                    />
                    <Text style={settingsStyles.settingText}>Language</Text>
                  </View>
                  <SoundTouchableOpacity
                    onPress={() => setShowLanguageDialog(true)}
                  >
                    <View style={settingsStyles.settingRight}>
                      <Text style={settingsStyles.settingValue}>
                        {selectedLanguage}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        style={settingsStyles.forwardIcon}
                      />
                    </View>
                  </SoundTouchableOpacity>
                </SoundTouchableOpacity>
              </View>

              <View style={settingsStyles.settingsGroup}>
                <SoundTouchableOpacity
                  style={settingsStyles.settingItem}
                  onPress={() => router.push("/user-term-conditions")}
                >
                  <View style={settingsStyles.settingLeft}>
                    <Image source={require("@/assets/icons/info.png")} style={style.icon} />
                    <Text style={settingsStyles.settingText}>
                      Terms & Conditions
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    style={settingsStyles.forwardIcon}
                  />
                </SoundTouchableOpacity>

                <SoundTouchableOpacity
                  style={settingsStyles.settingItem}
                  onPress={() => router.push("/privacy-policy")}
                >
                  <View style={settingsStyles.settingLeft}>
                    <Image
                      source={require("@/assets/icons/policy.png")} style={style.icon}
                    />
                    <Text style={settingsStyles.settingText}>
                      Privacy Policy
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    style={settingsStyles.forwardIcon}
                  />
                </SoundTouchableOpacity>

                <SoundTouchableOpacity
                  style={settingsStyles.settingItem}
                  onPress={() => router.push("/faq")}
                >
                  <View style={settingsStyles.settingLeft}>
                    <Image source={require("@/assets/icons/faqs.png")} style={style.icon} />
                    <Text style={settingsStyles.settingText}>FAQs?</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    style={settingsStyles.forwardIcon}
                  />
                </SoundTouchableOpacity>

                <SoundTouchableOpacity
                  style={settingsStyles.settingItem}
                  onPress={() => router.push("/help-center")}
                >
                  <View style={settingsStyles.settingLeft}>
                    <Image
                      source={require("@/assets/icons/help_center.png")} style={style.icon}
                    />
                    <Text style={settingsStyles.settingText}>
                      Help Center ?
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    style={settingsStyles.forwardIcon}
                  />
                </SoundTouchableOpacity>
              </View>

              <SoundTouchableOpacity
                style={[allStyles.solidBtn, style.solidBtn]}
                onPress={() => setShowLogout(true)}
              >
                <Image
                  source={require("../../../assets/icons/logout.png")}
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                    marginRight: responsiveWidth(2),
                  }}
                />
                <Text style={[allStyles.solidBtnText, { color: '#cc1111' }]}>Logout</Text>
              </SoundTouchableOpacity>
            </View>
          </ScrollView>

          {showLogout && (
            <View style={dialogStyles.dialogOverlay}>
              <View style={dialogStyles.dialogContainer}>
                <View style={dialogStyles.dialogContent}>
                  <View style={dialogStyles.warningImg}>
                    <Image source={require("@/assets/warning.png")} />
                  </View>
                  <Text style={dialogStyles.dialogText}>
                    Are you sure {"\n"} you want to Log out?
                  </Text>
                </View>
                <View style={dialogStyles.dialogButtons}>
                  <SoundTouchableOpacity
                    style={dialogStyles.cancelButton}
                    onPress={handleCancel}
                  >
                    <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                  </SoundTouchableOpacity>
                  <SoundTouchableOpacity
                    style={dialogStyles.okButton}
                    onPress={() => router.push("/login")}
                  >
                    <Text style={dialogStyles.okButtonText}>Logout</Text>
                  </SoundTouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {showLanguageDialog && (
            <View style={dialogStyles.dialogOverlay}>
              <View style={dialogStyles.dialogContainer}>
                <Text style={dialogStyles.dialogTitle}>Select Language</Text>
                <View style={dialogStyles.dialogContent}>
                  <View style={dialogStyles.languageSelector}>
                    {languageOptions.map((language) => (
                      <SoundTouchableOpacity
                        key={language}
                        style={[
                          dialogStyles.languageOption,
                          tempSelectedLanguage === language &&
                          dialogStyles.selectedLanguageOption,
                        ]}
                        onPress={() => handleLanguageSelect(language)}
                      >
                        <Text
                          style={[
                            dialogStyles.languageText,
                            tempSelectedLanguage === language &&
                            dialogStyles.selectedLanguageText,
                          ]}
                        >
                          {language}
                        </Text>
                      </SoundTouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={dialogStyles.dialogButtons}>
                  <SoundTouchableOpacity
                    style={dialogStyles.cancelButton}
                    onPress={() => setShowLanguageDialog(false)}
                  >
                    <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                  </SoundTouchableOpacity>
                  {/* <SoundTouchableOpacity
                  style={dialogStyles.okButton}
                  onPress={() => setShowLanguageDialog(false)}
                >
                  <Text style={dialogStyles.okButtonText}>OK</Text>
                </SoundTouchableOpacity> */}
                  <SoundTouchableOpacity
                    style={dialogStyles.okButton}
                    onPress={handleLanguageOK}
                  >
                    <Text style={dialogStyles.okButtonText}>OK</Text>
                  </SoundTouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  solidBtn: {
    flexDirection: "row",
    justifyContent: "center",
  },

  icon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6)
  }
});
