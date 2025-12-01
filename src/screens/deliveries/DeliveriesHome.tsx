import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { authStyles, globalStyles } from "../../styles";

import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles//deliveries/deliveriesHomeStyles";
import { allStyles } from "../../styles/global";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { requestOTP } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // Allow only digits and limit to 15 characters (including country code)
    const phoneRegex = /^\d{1,15}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.trim()) {
      setPhoneNumber(""); // Clear phone when email is entered
    }
  };

  const handlePhoneChange = (text: string) => {
    // Only allow digits and max 15 characters

    setPhoneNumber(text.trim());
    // if (text.trim()) {
    //   setEmail(""); // Clear email when phone is entered
    // }
  };

  const handleLogin = async () => {
    router.push("/(tabs)/home");
    // if (!email.trim()) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Please enter your email address",
    //   });
    //   return;
    // }

    // if (!validateEmail(email)) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Please enter a valid email address",
    //   });
    //   return;
    // }

    // setIsLoading(true);

    // try {
    //   const response = await requestOTP({ email: email.trim() });

    //   if (response.success) {
    //     router.push({
    //       pathname: "/otp",
    //       params: { email: email.trim() },
    //     });
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1: "Error",
    //       text2: "Failed to send OTP",
    //     });
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "An unexpected error occurred",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      {/* <ImageBackground
        source={require("@/assets/bg.png")}
        style={styles.container}
        resizeMode="cover"
      > */}
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={allStyles.scrollContent}>
            <View style={allStyles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("@/assets/icons/loginPageLogo.png")}
                  style={styles.buildingImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={authStyles.title}>Get Started</Text>

              <Text style={authStyles.subtitle}>
                Sign in to Start your session
              </Text>
              <View style={styles.dividerLine}>
              </View>
              

              <TextInput
                style={globalStyles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />


              
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                />
                <View  style={styles.forgetPasswordContainer}>
                  <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
                </View>
                      <View style={styles.loginButtonContainer}>
              <TouchableOpacity
                style={[
                  allStyles.btn,
                  isLoading && styles.otpButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={allStyles.btnText}>Login</Text>
                )}
              </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Toast />
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

