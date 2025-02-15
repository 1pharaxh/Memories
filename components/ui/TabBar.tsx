import { View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";

import TabBarIcon from "./TabBarIcon";
import { useColorScheme } from "nativewind";
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
  const style = useSharedValue({
    scale: 1.1,
    height: 90,
    gap: 30,
    padding: 20,
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
        style.value = withSpring({
          scale: 0.85,
          height: 75,
          gap: 20,
          padding: 28,
        });
        runOnJS(setIsExpanded)(false);
      } else {
        style.value = withSpring({
          scale: 1.1,
          height: 90,
          gap: 30,
          padding: 20,
        });
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
      paddingHorizontal: style.value.padding,
      transform: [
        {
          scale: style.value.scale,
        },
      ],
    };
  });

  const middleIndex = useMemo(() => Math.floor(state.routes.length / 2), []);

  return (
    <GestureDetector gesture={gestureHandler}>
      <View className="flex flex-row absolute bottom-0 h-1/4 items-end justify-center pb-6 w-full">
        <Animated.View
          style={animatedStyle}
          className="mx-auto min-w-fit max-w-[80%] mt-8 flex flex-row rounded-[5rem] items-center justify-between px-7"
        >
          <BlurView
            intensity={60}
            tint="dark"
            className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-[5rem]"
          />
          {state.routes.map((route: any, index: number) => (
            <TabBarIcon
              colorScheme={colorScheme}
              descriptors={descriptors}
              index={index}
              isExpanded={isExpanded}
              navigation={navigation}
              position={position}
              route={route}
              state={state}
              key={route.key}
            />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
