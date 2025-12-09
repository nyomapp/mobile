import { router } from "expo-router";
import { useEffect, useState } from "react";
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

import { TokenStorage } from "@/src/api/tokenStorage";
import { COLORS } from "@/src/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/loginStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("ram@gmail.com");
  const [password, setPassword] = useState("Abcd@1234");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

    useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const user = await TokenStorage.getUser();
 
        if (user && user.id) {
          // User is logged in, redirect to home
          router.replace('/(tabs)/home');
        } else {
          // No user found, show onboarding
          setTimeout(() => {
            router.replace('/login');
          }, 3000);
        }
      } catch (error) {
        // Error getting user, show onboarding
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      }
    };
 
    checkUserAndRedirect();
  }, [router]);



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
      setPassword(""); // Clear password when email is entered
    }
  };

  const handlePasswordChange = (text: string) => {
    // Only allow digits and max 15 characters

    setPassword(text.trim());
    // if (text.trim()) {
    //   setEmail(""); // Clear email when phone is entered
    // }
  };

  const handleLogin = async () => {
 
 
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email is required.",
      });
      return;
    }

    if (!password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password is required.",
      });
      return;
    }
 
    setIsLoading(true);
 
    try {
      const response = await login({
        email: email,
        password: password,
      });
 
      if (response.success) {
        router.push("/(tabs)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Invalid password. Please try again.",
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
                placeholderTextColor={COLORS.black}
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />


              
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor={COLORS.black}
                  value={password}
                  onChangeText={handlePasswordChange}
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

