import { ComponentProps } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Link } from "expo-router";

const ICON_SIZE = 22;

interface IconButtonProps {
  iosName: SFSymbol;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  width?: number;
  height?: number;
  tintColor?: string;
  disabled?: boolean;
}
export default function IconButton({
  onPress,
  iosName,
  containerStyle,
  height,
  width,
  tintColor = "white",
  disabled = false,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.5}
      className="bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
      style={[containerStyle]}
    >
      <SymbolView
        name={iosName}
        size={ICON_SIZE}
        // type="hierarchical"
        style={
          width && height //this won't scale :(
            ? {
                width,
                height,
              }
            : {}
        }
        tintColor={tintColor}
      />
    </TouchableOpacity>
  );
}
