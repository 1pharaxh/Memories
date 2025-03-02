import { BlurView } from "expo-blur";
import React from "react";
import { Platform, View } from "react-native";
import TabBarText from "./TabBarText";
import { Aperture } from "~/lib/icons/Aperture";
import { useRouter } from "expo-router";
import TouchableBounce from "./TouchableBounce";

type TabBarEditIconsProps = {
  label: string;
  colorScheme: "dark" | "light" | undefined;
};

const TabBarEditIcons = ({ label, colorScheme }: TabBarEditIconsProps) => {
  const router = useRouter();

  const onPress = async () => {
    try {
      // Trigger haptics first
      router.push("/preset-sheet");
    } catch (error) {
      console.error("Haptics error:", error);
    }
  };

  const onLongPress = async () => {
    try {
      // Trigger haptics first
      router.push("/preset-sheet");
    } catch (error) {
      console.error("Haptics error:", error);
    }
  };
  return (
    <TouchableBounce
      sensory="rigid"
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={Platform.OS === "web" ? "link" : "button"}
    >
      <View className="flex items-center justify-center flex-col">
        <BlurView
          intensity={30}
          tint={colorScheme === "light" ? "prominent" : "extraLight"}
          className="rounded-full overflow-hidden h-12 w-12 justify-center items-center"
        >
          <Aperture size={17} strokeWidth={2} className="text-white" />
        </BlurView>

        <TabBarText>{label}</TabBarText>
      </View>
    </TouchableBounce>
  );
};

export default TabBarEditIcons;
