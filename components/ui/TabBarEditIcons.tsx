import { BlurView } from "expo-blur";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";
import TabBarText from "./TabBarText";
import { Aperture } from "~/lib/icons/Aperture";
import * as Haptics from "expo-haptics";

type TabBarEditIconsProps = {
  label: string;
  colorScheme: "dark" | "light" | undefined;
};

const TabBarEditIcons = ({ label, colorScheme }: TabBarEditIconsProps) => {
  const onPress = async () => {
    try {
      // Trigger haptics first
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    } catch (error) {
      console.error("Haptics error:", error);
    }
  };

  const onLongPress = async () => {
    try {
      // Trigger haptics first
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    } catch (error) {
      console.error("Haptics error:", error);
    }
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex aspect-square cursor-pointer items-center justify-center rounded-full min-h-10"
      accessibilityRole={Platform.OS === "web" ? "link" : "button"}
    >
      <BlurView
        intensity={30}
        tint={colorScheme === "light" ? "prominent" : "extraLight"}
        className="rounded-full overflow-hidden h-12 w-12 justify-center items-center"
      >
        <Aperture size={17} strokeWidth={2} className="text-white" />
      </BlurView>

      <TabBarText className="text-white text-xs mt-2">{label}</TabBarText>
    </TouchableOpacity>
  );
};

export default TabBarEditIcons;
