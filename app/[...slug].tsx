import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

const screenMap = {
  login: () => require("../src/screens/auth/LoginScreen").default,
  otp: () => require("../src/screens/auth/OTPScreen").default,
  verified: () => require("../src/screens/auth/VerifiedScreen").default,
  "edit-profile": () => require("../src/screens/profile/EditProfile").default,
  "personal-info": () => require("../src/screens/profile/PersonalInfo").default,
  notification: () => require("../src/screens/home/NotificationScreen").default,
};

export default function DynamicScreen() {
  const { slug } = useLocalSearchParams();
  const screenName = Array.isArray(slug) ? slug[0] : slug;

  const Screen = useMemo(() => {
    const screenLoader = screenMap[screenName];
    return screenLoader ? screenLoader() : screenMap["login"]();
  }, [screenName]);

  return <Screen />;
}
