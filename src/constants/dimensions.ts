import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = {
  screenWidth: width,
  screenHeight: height,
  padding: {
    small: 20,
    medium: 20,
    large: 40,
  },
  borderRadius: {
    small: 10,
    medium: 20,
    large: 30,
  },
  iconSize: {
    small: 22,
    medium: 23,
    large: 100,
  },
};