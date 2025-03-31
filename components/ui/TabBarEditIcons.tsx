import { BlurView } from "expo-blur";
import React from "react";
import { Platform, View } from "react-native";
import TabBarText from "./TabBarText";
import { useRouter } from "expo-router";
import TouchableBounce from "./TouchableBounce";

type TabBarEditIconsProps = {
  label: {
    name: string;
    type: string;
    sheetTitle: string;
    icon: React.JSX.Element;
  };
  colorScheme: "dark" | "light" | undefined;
};

const TabBarEditIcons = ({ label, colorScheme }: TabBarEditIconsProps) => {
  const router = useRouter();

  const onPress = async () => {
    try {
      router.push(
        `/preset-sheet?type=${label.type}&sheetTitle=${label.sheetTitle}`
      );
    } catch (error) {
      console.error("Haptics error:", error);
    }
  };

  const onLongPress = async () => {
    try {
      // Trigger haptics first
      router.push(
        `/preset-sheet?type=${label.type}&sheetTitle=${label.sheetTitle}`
      );
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
      <View className="flex items-center justify-center flex-col -mb-14">
        <BlurView
          intensity={30}
          tint={colorScheme === "light" ? "prominent" : "extraLight"}
          className="rounded-full overflow-hidden h-12 w-12 justify-center items-center"
        >
          {label.icon}
        </BlurView>

        <TabBarText>{label.name}</TabBarText>
      </View>
    </TouchableBounce>
  );
};

export default TabBarEditIcons;
