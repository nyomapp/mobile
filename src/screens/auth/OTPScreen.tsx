import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { SoundTouchableOpacity } from "../../components/SoundTouchableOpacity";
import { useAuth } from "../../contexts/AuthContext";
import { authStyles, globalStyles, otpStyles } from "../../styles";
import { allStyles } from "../../styles/global";

export default function OTPScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<TextInput[]>([]);
  const { verifyOTP, requestOTP } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params.email]);

  const handleOtpChange = (value: string, index: number) => {
    // Handle paste - if value is longer than 1 character
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 4).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (i < 4) newOtp[i] = digit;
      });
      setOtp(newOtp);
      // Focus on the last filled input or next empty one
      const nextIndex = Math.min(pastedOtp.length, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the complete 4-digit OTP",
      });
      return;
    }

    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email not found. Please try logging in again.",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOTP({
        email: email,
        otp: otpString,
      });

      if (response.success) {
        router.push("/verified");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid OTP. Please try again.",
        });
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email not found. Please try logging in again.",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestOTP({ email });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP resent successfully!",
        });
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to resend OTP",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <ImageBackground
        source={require("@/assets/bg.png")}
        style={allStyles.background}
        resizeMode="cover"
      >

        <KeyboardAvoidingView
          style={globalStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={allStyles.scrollContent}>

            <View style={allStyles.container}>


              <View style={authStyles.imageContainer}>
                <Image
                  source={require("@/assets/otpImg.png")}
                  style={otpStyles.atmImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={authStyles.title}>Enter OTP</Text>

              <Text style={authStyles.subtitle}>
                Enter the verification code we just sent on your email address.
              </Text>

              <View style={otpStyles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      otpStyles.otpInput,
                      digit ? otpStyles.otpInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={index === 0 ? 4 : 1}
                    textAlign="center"
                  />
                ))}
              </View>

              <SoundTouchableOpacity
                style={[
                  allStyles.outlineBtn,
                  isLoading && styles.otpButtonDisabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={allStyles.outlineBtnText}>Verify</Text>
                )}
              </SoundTouchableOpacity>

              <View style={otpStyles.resendContainer}>
                <Text style={otpStyles.resendText}>Didn't received code? </Text>
                <SoundTouchableOpacity
                  onPress={handleResendOTP}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      otpStyles.resendLink,
                      isLoading && { opacity: 0.5 },
                    ]}
                  >
                    {isLoading ? "Resend" : "Resend"}
                  </Text>
                </SoundTouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Toast />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  otpButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
});
