import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import Toast from "react-native-toast-message";

import { changePassword } from "@/src/api/editProfile";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useAuth } from "@/src/contexts/AuthContext";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/changePasswordStyles";
import { allStyles } from "../../styles/global";

export default function ChangePassword() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    return () => {
      console.log("Cleaning up ChangePassword screen...");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    };
  }, []);

  const handleBack = () => {
    router.push("/(tabs)/settings");
  };
  // handle validation
  const validatePasswords = () => {
    if (!oldPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your old password",
      });
      return false;
    }

    if (!newPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter your new password",
      });
      return false;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please confirm your new password",
      });
      return false;
    }

    if (oldPassword === newPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "New password must be different from old password",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "New password and confirm password don't match",
      });
      return false;
    }

    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePasswords()) {
      return;
    }
    try {
      const formData = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      await changePassword(formData, user?.id);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password changed successfully",
      });
      setTimeout(() => {
        router.push("/(tabs)/settings");
      }, 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while changing the password",
      });
    }
    // console.log("Password changed successfully");
    // Handle password change logic here
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[
            allStyles.headerContainer,
            { justifyContent: "space-between" },
          ]}
        >
          <TouchableOpacity
            onPress={handleBack}
            style={[allStyles.backButton, allStyles.backButtonBackgroundStyle]}
          >
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <HeaderIcon />
        </View>

        <ScrollView
          style={allStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page Title */}
          <View style={{ paddingVertical: responsiveWidth(6) }}>
            <Text style={styles.headerStyle}>Change Password</Text>
          </View>

          {/* Password Input Fields */}
          <View
            style={{
              gap: responsiveWidth(4),
              paddingHorizontal: responsiveWidth(1),
            }}
          >
            <View style={allStyles.formContainer}>
              <TextInput
                style={globalStyles.input}
                placeholder="Old Password"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                autoCorrect={false}
              />
            </View>
            <View style={allStyles.formContainer}>
              <TextInput
                style={globalStyles.input}
                placeholder="New Password"
                // placeholderTextColor={COLORS.black}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCorrect={false}
              />
            </View>

            <View style={allStyles.formContainer}>
              <TextInput
                style={globalStyles.input}
                placeholder="Confirm Password"
                // placeholderTextColor={COLORS.black}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCorrect={false}
              />
            </View>
          </View>
        </ScrollView>

        {/* Action Section - Outside ScrollView to stick to bottom */}
        <View style={allStyles.bottomContainer}>
          <TouchableOpacity style={allStyles.btn} onPress={handleSavePassword}>
            <Text style={allStyles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
