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

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/changePasswordStyles";
import { allStyles } from "../../styles/global";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }
    console.log("Password changed successfully");
    // Handle password change logic
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={allStyles.headerContainer}>
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
                placeholder="New Password"
                placeholderTextColor="#9CA3AF"
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
                placeholderTextColor="#9CA3AF"
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
