import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { CoinContainer } from "../../components/common";
import { useAuth } from "../../contexts";
import { homeStyles } from "../../styles";
import { allStyles } from "../../styles/global";
interface HeaderProps {
  showCommunity?: boolean;
  showNotification?: boolean;
  showSettings?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showCommunity = true,
  showNotification = true,
  showSettings = true,
}) => {
  const { user } = useAuth();
  return (
    <View style={allStyles.header}>
      <TouchableOpacity onPress={() => router.push("/wallet")}>
        <View style={homeStyles.headerLeft}>
          <CoinContainer coins={user?.gameCoins || 0} />
        </View>
      </TouchableOpacity>
      <View style={allStyles.headerRight}>
        <TouchableOpacity
          style={allStyles.iconButton}
          onPress={() => router.push("/notification")}
        >
          <Image
            source={require("../../../assets/icons/notification.png")}
            // style={{ width: 22, height: 22, tintColor: "white" }}
            style={allStyles.headerRightIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={allStyles.iconButton}
          onPress={() => router.push("/settings")}
        >
          <Image
            source={require("../../../assets/icons/settings.png")}
            // style={{ width: 22, height: 22, tintColor: "white" }}
            style={allStyles.headerRightIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
