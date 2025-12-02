import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";
import { settingsStyles } from "../../styles/settingsStyles";

export default function SettingsScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    console.log("Edit Profile pressed");
    // Navigate to edit profile screen
  };

  const handleChangePassword = () => {
    console.log("Change Password pressed");
    router.push("/change-password");
    // Navigate to change password screen
  };

  const handleLogout = () => {
    console.log("Logout pressed");
    // Handle logout logic
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

        <ScrollView style={allStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={settingsStyles.profileSection}>
            <Image style={settingsStyles.profileImage} />
            <View>
            <Text style={settingsStyles.userName}>Sivesh Kumar</Text>
            <Text style={settingsStyles.companyName}>Company Name</Text>
            <TouchableOpacity 
              style={settingsStyles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Text style={settingsStyles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          </View>

          {/* Contact Information */}
          <View style={settingsStyles.contactSection}>
            {/* Email */}
            <View style={settingsStyles.contactItem}>
              <View style={settingsStyles.contactIcon}>
                <Image
                  source={require("@/assets/icons/MessageIcon.png")} // Replace with email icon
                  style={settingsStyles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={settingsStyles.contactInfo}>
                <Text style={settingsStyles.contactLabel}>Email</Text>
                <Text style={settingsStyles.contactValue}>Sivesh200@gmail.com</Text>
              </View>
            </View>

            {/* Mobile */}
            <View style={settingsStyles.contactItem}>
              <View style={settingsStyles.contactIcon}>
                <Image
                  source={require("@/assets/icons/PhoneIcon.png")} // Replace with phone icon
                  style={settingsStyles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={settingsStyles.contactInfo}>
                <Text style={settingsStyles.contactLabel}>Mobile</Text>
                <Text style={settingsStyles.contactValue}>9205722137</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Section - Outside ScrollView to stick to bottom */}
        <View style={allStyles.bottomContainer}>
          <TouchableOpacity 
            style={allStyles.backButton}
            onPress={handleChangePassword}
          >
            <Text style={allStyles.backButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={allStyles.btn}
            onPress={handleLogout}
          >
            <Text style={allStyles.btnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

