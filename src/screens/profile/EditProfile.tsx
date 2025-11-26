import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { TokenStorage, UsersAPI } from "../../api";
import { SoundTouchableOpacity } from "../../components/SoundTouchableOpacity";
import { useAuth } from "../../contexts/AuthContext";
import { dialogStyles, globalStyles, profileStyles } from "../../styles";
import { allStyles } from "../../styles/global";

import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [currentField, setCurrentField] = useState<string>("");
  const [tempValue, setTempValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [updatedField, setUpdatedField] = useState("");
  const [hasChanged, setHasChanged] = useState(false);


  const handleCancel = () => {
    setShowLogout(false);
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

  const openDialog = (field: string) => {
    setCurrentField(field);
    let currentValue = "";

    if (field === "fullName") {
      currentValue = getUserDisplayName();
    } else if (field === "phone") {
      currentValue = user?.phone || "";
    } else if (field === "email") {
      currentValue = user?.email || "";
    }

    setTempValue(currentValue);
    setHasChanged(false);
    setShowDialog(true);
  };


  const handleDialogOK = async () => {
    if (!user?.id || !tempValue.trim()) return;

    setIsSaving(true);
    try {
      let updateData = {};

      if (currentField === "fullName") {
        const names = tempValue.trim().split(" ");
        updateData = {
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
        };
      } else if (currentField === "email") {
        updateData = { email: tempValue.trim() };
      } else if (currentField === "phone") {
        updateData = { phone: tempValue.trim() };
      }

      // Step 1: Update profile API call
      const response = await UsersAPI.updateUser(user.id, updateData);
      if (response.success && response.data?.data?.user) {
        await TokenStorage.setUser(response.data.data.user);
        await updateUser(response.data.data.user);

        // Step 2: Check if mobile/email is different and needs verification
        if (currentField === "email" || currentField === "phone") {
          const oldValue = currentField === "email" ? user?.email : user?.phone;
          if (tempValue.trim() !== oldValue) {
            setNeedsVerification(true);
            setUpdatedField(currentField);
          }
        }

        setShowDialog(false);
        Toast.show({
          type: "success",
          text1: "Updated",
          text2: `${getFieldTitle()} updated successfully`,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyClick = async () => {
    setIsSaving(true);
    try {
      const response = await UsersAPI.reVerify({
        type: updatedField as 'email' | 'phone',
        action: 'resend',
      });

      if (response.success) {
        setShowOtpDialog(true);
        setNeedsVerification(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send verification code",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!user?.id || !otpValue.trim()) return;

    setIsSaving(true);
    try {
      const verifyResponse = await UsersAPI.reVerify({
        type: currentField as 'email' | 'phone',
        action: 'verify',
        email: currentField === 'email' ? tempValue.trim() : undefined,
        phone: currentField === 'phone' ? tempValue.trim() : undefined,
        otp: otpValue.trim()
      });

      if (verifyResponse.success) {
        const updateData = currentField === "email"
          ? { email: tempValue.trim() }
          : { phone: tempValue.trim() };

        const updateResponse = await UsersAPI.updateUser(user.id, updateData);
        if (updateResponse.success && updateResponse.data?.data?.user) {
          await TokenStorage.setUser(updateResponse.data.data.user);
          await updateUser(updateResponse.data.data.user);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: `${currentField === "email" ? "Email" : "Phone"} updated successfully`,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid verification code. Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify code. Please try again.",
      });
    } finally {
      setIsSaving(false);
      setShowOtpDialog(false);
      setCurrentField("");
      setOtpValue("");
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setCurrentField("");
    setTempValue("");
  };

  const handleOtpCancel = () => {
    setShowOtpDialog(false);
    setCurrentField("");
    setOtpValue("");
  };

  const getFieldTitle = () => {
    switch (currentField) {
      case "fullName": return "Full Name";
      case "phone": return "Phone Number";
      case "email": return "Email";
      default: return "";
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!user?.id) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "User ID not found",
        });
        return;
      }

      const response = await UsersAPI.deleteUser(user.id);

      if (response.success) {
        await TokenStorage.removeToken();
        router.replace("/login");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to delete account. Please try again.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred.",
      });
    } finally {
      setShowLogout(false);
    }
  };

  const validateName = (text: string, maxLength: number = 32): string => {
    return text.replace(/[^A-Za-z ]/g, '').slice(0, maxLength);
  };
  const validatePhone = (text: string): string => {
    return text.replace(/[^0-9]/g, '').slice(0, 10);
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
          <View style={allStyles.solidHeader}>
            <View style={allStyles.header}>
              <SoundTouchableOpacity onPress={() => router.push("/settings")}>
                <View style={allStyles.btnCircle}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </View>
              </SoundTouchableOpacity>
              <Text style={allStyles.headerTitle}>Edit Profile</Text>
              <View style={allStyles.headerRight} />
            </View>
          </View>

          <ScrollView contentContainerStyle={allStyles.scrollContent}>
            <View style={allStyles.container}>
              <View style={profileStyles.editProfileSection}>
                <View style={profileStyles.charactersImg}>
                  <Image
                    source={
                      user?.avatarUrl
                        ? { uri: user.avatarUrl }
                        : require("@/assets/characters/avatar2.png")
                    }
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                  <SoundTouchableOpacity
                    onPress={() => router.push("/select-avatar")}
                  >
                    <View style={profileStyles.editCircle}>
                      <Image source={require("@/assets/edit.png")} />
                    </View>
                  </SoundTouchableOpacity>
                </View>
                <Text style={profileStyles.avatarText}>Change Avatar</Text>
              </View>

              <View style={profileStyles.settingsGroup}>
                <SoundTouchableOpacity
                  style={profileStyles.settingItem}
                  onPress={() => openDialog("fullName")}
                >
                  <View style={profileStyles.settingLeft}>
                    <Text style={profileStyles.settingText}>Full Name</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Text
                      style={[profileStyles.settingRight, { flex: 1, textAlign: 'right' }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {getUserDisplayName()}
                    </Text>
                    <Ionicons name="chevron-forward" style={profileStyles.forwardIcon} />
                  </View>
                </SoundTouchableOpacity>

                <SoundTouchableOpacity
                  style={profileStyles.settingItem}
                  onPress={() => openDialog("phone")}
                >
                  <View style={profileStyles.settingLeft}>
                    <Text style={profileStyles.settingText}>Phone Number</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Text
                      style={[profileStyles.settingRight, { flex: 1, textAlign: 'right' }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {user?.phone || "Not provided"}
                    </Text>
                    {needsVerification && updatedField === "phone" ? (
                      <SoundTouchableOpacity
                        onPress={handleVerifyClick}
                        disabled={isSaving}
                        style={{ backgroundColor: "#FFB200", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8 }}
                      >
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Verify</Text>
                      </SoundTouchableOpacity>
                    ) : (
                      <Ionicons name="chevron-forward" style={profileStyles.forwardIcon} />
                    )}
                  </View>
                </SoundTouchableOpacity>

                <SoundTouchableOpacity
                  style={profileStyles.settingItem}
                  onPress={() => openDialog("email")}
                >
                  <View style={profileStyles.settingLeft}>
                    <Text style={profileStyles.settingText}>Email</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Text
                      style={[profileStyles.settingRight, { flex: 1 }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {user?.email || "Not provided"}
                    </Text>
                    {needsVerification && updatedField === "email" ? (
                      <SoundTouchableOpacity
                        onPress={handleVerifyClick}
                        disabled={isSaving}
                        style={{ backgroundColor: "#FFB200", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8 }}
                      >
                        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>Verify</Text>
                      </SoundTouchableOpacity>
                    ) : (
                      <Ionicons name="chevron-forward" style={profileStyles.forwardIcon} />
                    )}
                  </View>
                </SoundTouchableOpacity>

              </View>

              <View style={profileStyles.settingsGroup}>
                <SoundTouchableOpacity
                  style={profileStyles.settingItem}
                  onPress={() => router.push("/personal-info")}
                >
                  <View style={profileStyles.settingLeft}>
                    <Text style={profileStyles.settingText}>Personal Info</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    style={profileStyles.forwardIcon}
                  />
                </SoundTouchableOpacity>
              </View>

            </View>
          </ScrollView>

          <View style={[{ marginHorizontal: responsiveWidth(4), marginBottom: responsiveWidth(4) }]}>
            <SoundTouchableOpacity
              style={allStyles.outlineBtn}
              onPress={() => setShowLogout(true)}
            >
              <Text style={allStyles.outlineBtnText}>Delete Account</Text>
            </SoundTouchableOpacity>
          </View>

          {/* Edit Dialog */}
          <Modal visible={showDialog} transparent animationType="slide">
            <View style={dialogStyles.dialogOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <View style={dialogStyles.dialogContainer}>
                  <Text style={dialogStyles.dialogTitle}>
                    {getFieldTitle()}
                  </Text>
                  <View style={dialogStyles.dialogContent}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "white",
                        marginVertical: 10,
                      }}
                      value={tempValue}
                      onChangeText={(text) => {
                        let newValue = text;
                        if (currentField === "fullName") {
                          newValue = validateName(text, 32);
                        } else if (currentField === "phone") {
                          newValue = validatePhone(text);
                        }
                        setTempValue(newValue);

                        // Check if value has changed from original
                        const originalValue = currentField === "fullName" ? getUserDisplayName() :
                          currentField === "phone" ? (user?.phone || "") :
                            currentField === "email" ? (user?.email || "") : "";
                        setHasChanged(newValue !== originalValue);
                      }}
                      placeholder={`Enter your ${getFieldTitle().toLowerCase()}`}
                      keyboardType={currentField === "email" ? "email-address" : currentField === "phone" ? "phone-pad" : "default"}
                      autoFocus={true}
                    />
                  </View>
                  <View style={dialogStyles.dialogButtons}>
                    <SoundTouchableOpacity
                      style={dialogStyles.cancelButton}
                      onPress={handleDialogCancel}
                    >
                      <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                    </SoundTouchableOpacity>
                    <SoundTouchableOpacity
                      style={[
                        dialogStyles.okButton,
                        (isSaving || !hasChanged) && { opacity: 0.7 },
                      ]}
                      onPress={handleDialogOK}
                      disabled={isSaving || !hasChanged}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={dialogStyles.okButtonText}>
                          Update
                        </Text>
                      )}
                    </SoundTouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

          {/* OTP Dialog */}
          <Modal visible={showOtpDialog} transparent animationType="slide">
            <View style={dialogStyles.dialogOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <View style={dialogStyles.dialogContainer}>
                  <Text style={dialogStyles.dialogTitle}>
                    Verify {getFieldTitle()}
                  </Text>
                  <View style={dialogStyles.dialogContent}>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      Enter the verification code sent to your {currentField}
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 12,
                        borderRadius: 8,
                        backgroundColor: "white",
                        marginVertical: 10,
                        textAlign: "center",
                      }}
                      value={otpValue}
                      onChangeText={setOtpValue}
                      placeholder="Enter verification code"
                      keyboardType="number-pad"
                      maxLength={6}
                      autoFocus={true}
                    />
                  </View>
                  <View style={dialogStyles.dialogButtons}>
                    <SoundTouchableOpacity
                      style={dialogStyles.cancelButton}
                      onPress={handleOtpCancel}
                    >
                      <Text style={dialogStyles.cancelButtonText}>Cancel</Text>
                    </SoundTouchableOpacity>
                    <SoundTouchableOpacity
                      style={[
                        dialogStyles.okButton,
                        isSaving && { opacity: 0.7 },
                      ]}
                      onPress={handleOtpVerify}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={dialogStyles.okButtonText}>Verify</Text>
                      )}
                    </SoundTouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

          {/* Delete Account Dialog */}
          {showLogout && (
            <View style={dialogStyles.dialogOverlay}>
              <View style={dialogStyles.dialogContainer}>
                <View style={dialogStyles.dialogContent}>
                  <View style={dialogStyles.warningImg}>
                    <Image source={require("@/assets/warning.png")} />
                  </View>
                  <Text style={dialogStyles.dialogText}>
                    Are you sure you want to say {"\n"} goodbye?
                  </Text>
                  <Text style={dialogStyles.dialogSmallText}>
                    We're sad to see you go! {"\n"} If you delete your account,
                    all data will be wiped.
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
                    onPress={handleDeleteAccount}
                  >
                    <Text style={dialogStyles.okButtonText}>Delete</Text>
                  </SoundTouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
}
