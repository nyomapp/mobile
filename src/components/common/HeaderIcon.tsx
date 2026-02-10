import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts";

import { FONTS } from "@/src/constants/fonts";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { allStyles } from "../../styles/global";
interface HeaderProps {
  showCommunity?: boolean;
  showNotification?: boolean;
  showSettings?: boolean;
}

export const HeaderIcon: React.FC<HeaderProps> = ({
  showCommunity = true,
  showNotification = true,
  showSettings = true,
}) => {
  const { user } = useAuth();
  return (
    <View style={allStyles.header}>
      <View style={[{ flexDirection: "column" }]}>
        <Image
          source={require("../../../assets/icons/nyomlogo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <Text
          style={{
            textAlign: "center",
            // marginTop: responsiveWidth(1),
            fontSize: responsiveFontSize(0.7),
            fontFamily: FONTS.Yellix,
            color: "#9CA3AF",
          }}
        >
          App Version: 1.0.4
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoImg: {
    width: 56,
    height: 42,
  },
});
