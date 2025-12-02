import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

const screenMap = {
  login: () => require("../src/screens/auth/LoginScreen").default,
  otp: () => require("../src/screens/auth/OTPScreen").default,
  "edit-profile": () => require("../src/screens/profile/EditProfile").default,
  "personal-info": () => require("../src/screens/profile/PersonalInfo").default,
  notification: () => require("../src/screens/home/NotificationScreen").default,
  "add-delivery": () => require("../src/screens/deliveries/AddDelivery").default,
  "document-screen": () => require("../src/screens/deliveries/DocumentsScreen").default,
  "document-scanner": () => require("../src/screens/common/Scanner").default,
  "amount": () => require("../src/screens/deliveries/Amount").default,
  "preview": () => require("../src/screens/deliveries/Preview").default,
  "other-documents": () => require("../src/screens/deliveries/OtherDocumentsScreen").default,
  "change-password": () => require("../src/screens/settings/ChangePassword").default,
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
