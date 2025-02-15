import { TouchableOpacity, Platform, View } from "react-native";

import { useColorScheme } from "nativewind";

import { useLinkBuilder } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Info } from "~/lib/icons/Info";
import TabBarText from "./TabBarText";
export default function MyTabBar({
  state,
  descriptors,
  navigation,
  position,
}: {
  state: any;
  descriptors: any;
  navigation: any;
  position: any;
}) {
  const { buildHref } = useLinkBuilder();

  const style = useSharedValue({
    scale: 1.2,
    height: 100,
    gap: 25,
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (isExpanded) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [isExpanded]);

  const gestureHandler = Gesture.Pan().onUpdate((e) => {
    // Determine movement direction
    const isVerticalMovement =
      Math.abs(e.translationY) > Math.abs(e.translationX);
    const isHorizontalMovement =
      Math.abs(e.translationX) > Math.abs(e.translationY);

    // Handle vertical movement
    if (isVerticalMovement && Math.abs(e.translationY) > 10) {
      if (e.translationY > 0) {
        style.value = withSpring({ scale: 0.85, height: 75, gap: 15 });
        runOnJS(setIsExpanded)(false);
      } else {
        style.value = withSpring({ scale: 1.2, height: 110, gap: 25 });
        runOnJS(setIsExpanded)(true);
      }
    }

    // Handle horizontal movement
    if (isHorizontalMovement && Math.abs(e.translationX) > 20) {
      if (e.translationX > 0) {
        const previousRoute = state.routes[state.index - 1];
        if (previousRoute) {
          runOnJS(navigation.navigate)(
            previousRoute.name,
            previousRoute.params
          );
        }
      } else {
        const nextRoute = state.routes[state.index + 1];
        if (nextRoute) {
          runOnJS(navigation.navigate)(nextRoute.name, nextRoute.params);
        }
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: style.value.height,
      gap: style.value.gap,
      transform: [
        {
          scale: style.value.scale,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gestureHandler}>
      <View className="flex flex-row absolute bottom-0 h-1/4 items-end justify-center pb-6 w-full">
        <Animated.View
          style={animatedStyle}
          className="mx-auto min-w-fit max-w-[80%] mt-8 flex flex-row rounded-[5rem] items-center justify-between px-10"
        >
          <BlurView
            intensity={60}
            tint="dark"
            className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-[5rem]"
          />
          {state.routes.map((route: any, index: number) => {
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
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
              navigation.navigate(route.name, route.params);
            };

            const inputRange = state.routes.map((_: any, i: any) => i);

            const opacity = position.interpolate({
              inputRange,
              outputRange: inputRange.map((i: number) =>
                i === index ? 1 : 0.3
              ),
            });

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
                  <Info size={17} strokeWidth={2} className="text-white" />
                </BlurView>
                {isExpanded && (
                  <TabBarText
                    className="text-white text-xs mt-2"
                    opacity={opacity}
                  >
                    {label}
                  </TabBarText>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
