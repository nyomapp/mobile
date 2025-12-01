import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { authStyles, globalStyles } from "../../styles";

import { COLORS, FONTS } from "@/src/constants";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 50,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: responsiveWidth(6),
  },
  buildingImage: {
    // width: 247,
    // height: 201,
    width: responsiveWidth(60),
    height: responsiveWidth(60),
  },
  title: {
    fontSize: 40,
    color: "white",
    textAlign: "left",
    marginBottom: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "white",
    textAlign: "left",
    marginBottom: 15,
  },
  input: {
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    // borderRadius: 25,
    // paddingHorizontal: 20,
    // paddingVertical: 15,
    // fontSize: 16,
    // color: "white",
    // marginBottom: 15,
    // paddingLeft: responsiveWidth(16),
  },
  orText: {
    color: "white",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
  },
  phoneContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    // borderRadius: 25,
    // marginBottom: 30,
  },
  countryCode: {
    // paddingHorizontal: 15,
    // paddingVertical: 15,
    position: "absolute",
    zIndex: 99,
    top: responsiveWidth(2.4),
    left: responsiveWidth(6),
  },
  flag: {
    fontSize: responsiveFontSize(3),
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 20,
    fontSize: 16,
    color: "white",
  },
  otpButton: {
    backgroundColor: "#00bfff",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  otpButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  otpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  dividerLine: {
    width: responsiveWidth(10),
    height: 1.2,
    backgroundColor: COLORS.primaryBlue,
    marginBottom: responsiveWidth(5),
  },
  forgetPasswordContainer: {
    alignItems: "center",
    marginBottom: responsiveWidth(5),
  },
  forgetPasswordText: {
    color: COLORS.primaryBlue,
    fontFamily: FONTS.Yellix,
    fontWeight: "600",
  },
  loginButtonContainer:{
    marginTop:"auto",
    marginBottom: responsiveWidth(10),
  }
});
