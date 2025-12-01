import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts";

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
      <Image source={require("../../../assets/icons/nyomLogo.png")} style={styles.logoImg}/>
    </View>
  );
};

const styles = StyleSheet.create({
   logoImg:{
    width:56,
    height:42,
   }
});

