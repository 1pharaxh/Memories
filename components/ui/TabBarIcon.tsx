import React from "react";
import { BlurView } from "expo-blur";
import { Platform, View } from "react-native";
import TabBarText from "./TabBarText";
import RecordingButton from "./RecordingButton";
import TouchableBounce from "./TouchableBounce";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedBlurView } from "./AnimatedBlurView";

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

  const { tabBarIcon: Icon } = options;

  const AnimatedIsExpanded = useDerivedValue(() => {
    return isExpanded;
  }, [isExpanded]);

  const AnimatedIsFocused = useDerivedValue(() => {
    return state.index === index;
  }, [state.index, index]);

  const TabBarPillTextStyle = useAnimatedStyle(() => {
    return {
      display:
        AnimatedIsFocused.value && AnimatedIsExpanded.value ? "flex" : "none",
      opacity: withTiming(
        AnimatedIsFocused.value && AnimatedIsExpanded.value ? 1 : 0,
        {
          duration: 300,
        }
      ),
    };
  });

  const InnerPillStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        AnimatedIsFocused.value && AnimatedIsExpanded.value ? 60 : 48,
        {
          duration: 300,
        }
      ),
      width: withTiming(
        AnimatedIsFocused.value && AnimatedIsExpanded.value ? 135 : 48,
        {
          duration: 300,
        }
      ),
    };
  });

  if (route.name === "index" && isFocused) {
    return <RecordingButton key={route.name} />;
  } else {
    return (
      <TouchableBounce
        sensory="medium"
        key={route.name}
        accessibilityRole={Platform.OS === "web" ? "link" : "button"}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <View className="flex items-center justify-center flex-col">
          <AnimatedBlurView
            style={InnerPillStyle}
            intensity={isFocused ? 50 : 0}
            tint={
              isFocused
                ? colorScheme === "light"
                  ? "prominent"
                  : "extraLight"
                : "default"
            }
            className="rounded-full overflow-hidden flex-row items-center justify-center gap-3"
          >
            <Icon />

            <Animated.Text
              style={TabBarPillTextStyle}
              className="text-lg tracking-tighter text-white text-center"
            >
              {label}
            </Animated.Text>
          </AnimatedBlurView>
        </View>
      </TouchableBounce>
    );
  }
}
