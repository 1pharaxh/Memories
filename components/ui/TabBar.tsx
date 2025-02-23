import { View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import TabBarIcon from "./TabBarIcon";
import { useColorScheme } from "nativewind";
import useGlobalStore from "~/store/globalStore";
import TabBarEditIcons from "./TabBarEditIcons";
import {
  triggerCameraHaptic,
  triggerCollapseHaptic,
  triggerExpandHaptic,
} from "~/lib/haptics";
import {
  editTabBarExpand,
  tabBarCameraExpand,
  tabBarCollapse,
  tabBarExpand,
} from "~/lib/animations";
import TouchableBounce from "./TouchableBounce";
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

  const { photo, video } = useGlobalStore();

  useEffect(() => {
    if (isExpanded) {
      triggerExpandHaptic();
    } else {
      triggerCollapseHaptic();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (state.routes[state.index].name === "index") {
      style.value = withSpring(tabBarCameraExpand);
      triggerCameraHaptic();
    } else {
      if (isExpanded) {
        style.value = withSpring(tabBarExpand);
      } else {
        style.value = withSpring(tabBarCollapse);
      }
    }
  }, [state.routes[state.index].name]);

  const gestureHandler = Gesture.Pan().onUpdate((e) => {
    // no need to handle gesture if the current route is the index route ie the camera route
    if (state.routes[state.index].name === "index") {
      return;
    }
    // Determine movement direction
    const isVerticalMovement =
      Math.abs(e.translationY) > Math.abs(e.translationX);
    const isHorizontalMovement =
      Math.abs(e.translationX) > Math.abs(e.translationY);

    // Handle vertical movement
    if (isVerticalMovement && Math.abs(e.translationY) > 10) {
      if (e.translationY > 0) {
        style.value = withSpring(tabBarCollapse);
        runOnJS(setIsExpanded)(false);
      } else {
        style.value = withSpring(tabBarExpand);
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

  useEffect(() => {
    if (photo || video) {
      // expand the tab bar when a photo or video is taken
      style.value = withSpring(editTabBarExpand);
    } else {
      // collapse the tab bar when the photo or video is cleared
      style.value = withSpring(tabBarExpand);
    }
  }, [photo, video]);

  return (
    <GestureDetector gesture={gestureHandler}>
      <View className="flex flex-row absolute bottom-0 h-1/4 items-end justify-center pb-6 w-full">
        <Animated.View
          style={animatedStyle}
          className="mx-auto min-w-fit mt-8 flex flex-row rounded-[5rem] items-center justify-between px-7"
        >
          <BlurView
            intensity={60}
            tint="dark"
            className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-[5rem]"
          />
          {/* {photo || video ? (
            <TouchableBounce className="abosulte" sensory onPress={() => {}}>
              <ArrowLeft size={17} strokeWidth={2} className="text-white" />
            </TouchableBounce>
          ) : null} */}
          {!photo && !video
            ? state.routes.map((route: any, index: number) => (
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
              ))
            : ["Filter", "Text", "Animations", "Crop", "Me"].map((w, idx) => (
                <TabBarEditIcons
                  colorScheme={colorScheme}
                  label={w}
                  key={idx}
                />
              ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
