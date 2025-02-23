import React from "react";
import { BlurView } from "expo-blur";
import { Platform } from "react-native";
import TabBarText from "./TabBarText";
import RecordingButton from "./RecordingButton";
import TouchableBounce from "./TouchableBounce";

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

  const onPress = async () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: route.name, merge: true });
    }
  };

  const onLongPress = async () => {
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
      <TouchableBounce
        sensory="medium"
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
        {isExpanded && <TabBarText opacity={opacity}>{label}</TabBarText>}
      </TouchableBounce>
    );
  }
}
