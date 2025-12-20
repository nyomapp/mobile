import React from 'react';
import { Image, Text, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { allStyles } from '../../styles/global';

interface CoinContainerProps {
  coins: number;
}

export const CoinContainer: React.FC<CoinContainerProps> = ({ coins }) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const calculateCoinContainerWidth = (coins: number) => {
    const coinString = formatNumber(coins);
    const baseWidth = responsiveWidth(16);
    const extraWidth = responsiveWidth(3) * (coinString.length - 3);
    return Math.max(baseWidth, baseWidth + extraWidth);
  };

  return (
    <View
      style={[
        allStyles.coinContainer,
        { width: calculateCoinContainerWidth(coins) },
      ]}
    >
      <Image
        source={require("@/assets/icons/coin.png")}
        style={allStyles.headerCoinIcon}
      />
      <Text style={allStyles.coinText}>
        {formatNumber(coins)}
      </Text>
    </View>
  );
};
