import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { soundManager } from "../utils/SoundUtils";

interface SoundTouchableOpacityProps extends TouchableOpacityProps {
  onPress?: () => void;
}

export const SoundTouchableOpacity: React.FC<SoundTouchableOpacityProps> = ({
  onPress,
  ...props
}) => {
  const handlePress = () => {
    soundManager.playClick();
    onPress?.();
  };

  return <TouchableOpacity {...props} onPress={handlePress} />;
};
