import React from "react";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Platform, TouchableOpacity } from "react-native";
import TabBarText from "./TabBarText";
import { SymbolView } from "expo-symbols";
import { Text } from "./text";
import RecordingButton from "./RecordingButton";

export default function TabBarIcon({
  state,
  descriptors,
  navigation,
  position,
  route,
  index,
  isExpanded,
  colorScheme,
}: {
  state: any;
  descriptors: any;
  navigation: any;
  position: any;
  route: any;
  index: number;
  isExpanded: boolean;
  colorScheme: "dark" | "light" | undefined;
}) {
  const { options } = descriptors[route.key];

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const isFocused = state.index === index;

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: route.name, merge: true });
    }
  };

  const onLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
    navigation.navigate({ name: route.name, merge: true });
  };

  const inputRange = state.routes.map((_: any, i: any) => i);

  const opacity = position.interpolate({
    inputRange,
    outputRange: inputRange.map((i: number) => (i === index ? 1 : 0.3)),
  });

  const { tabBarIcon } = options;

  if (route.name === "index" && isFocused) {
    return <RecordingButton key={route.name} />;
  } else {
    return (
      <TouchableOpacity
        className="flex aspect-square cursor-pointer items-center justify-center rounded-full min-h-10"
        key={route.name}
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <BlurView
          intensity={isFocused ? 50 : 30}
          tint={colorScheme === "light" ? "prominent" : "extraLight"}
          className="rounded-full overflow-hidden h-12 w-12 justify-center items-center"
        >
          {tabBarIcon &&
            tabBarIcon({
              focused: isFocused,
              color: isFocused ? "#ffffff" : "#ffffff80",
              size: 24,
            })}
        </BlurView>
        {isExpanded && (
          <TabBarText className="text-white text-xs mt-2" opacity={opacity}>
            {label}
          </TabBarText>
        )}
      </TouchableOpacity>
    );
  }
}
