import { LayoutChangeEvent, TouchableOpacity, View } from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Share } from "~/lib/icons/Share";
import { shareAsync } from "expo-sharing";

import TabBarIcon, { TAB_BAR_SPRING } from "./TabBarIcon";
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
import { cx } from "class-variance-authority";
import TabBarText from "./TabBarText";
import { PRESET_OPTIONS } from "~/lib/constants";
import { AnimatedBlurView } from "./AnimatedBlurView";
import { cn } from "~/lib/utils";
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
    borderRadius: "5rem",
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { colorScheme } = useColorScheme();

  const { photo, video, setPhoto, setVideo } = useGlobalStore();

  useEffect(() => {
    if (isExpanded) {
      triggerExpandHaptic();
    } else {
      triggerCollapseHaptic();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (photo || video) {
      // expand the tab bar when a photo or video is taken
      style.value = withSpring(editTabBarExpand);
    } else {
      // collapse the tab bar when the photo or video is cleared
      if (state.routes[state.index].name === "index") {
        style.value = withSpring(tabBarCameraExpand);
        triggerCameraHaptic();
        return;
      } else {
        if (isExpanded) {
          style.value = withSpring(tabBarExpand);
        } else {
          style.value = withSpring(tabBarCollapse);
        }
      }
    }
  }, [state.routes[state.index].name, photo, video, isExpanded]);

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
      borderRadius: style.value.borderRadius,
      transform: [
        {
          scale: style.value.scale,
        },
      ],
    };
  });

  const tabbarWidth = useSharedValue<number>(0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    tabbarWidth.set(width);
  }, []);

  const animatedIsExpanded = useDerivedValue(() => {
    return isExpanded;
  }, [isExpanded]);

  const currentTabIndex = useDerivedValue(() => {
    return state.index;
  }, [state.index]);

  const tabWidth = useDerivedValue(() => {
    return tabbarWidth.value / 3;
  });

  const tabpillHighlightStyle = useAnimatedStyle(() => {
    const tabWidth = tabbarWidth.value / 3;
    const translationX = currentTabIndex.value * tabWidth;
    const left = interpolate(
      translationX,
      [0, tabbarWidth.value],
      [6, tabbarWidth.value - tabWidth]
    );

    return {
      opacity: withSpring(
        animatedIsExpanded.value && currentTabIndex.value !== 1 ? 1 : 0
      ),
      left: withSpring(left, TAB_BAR_SPRING),
    };
  });

  return (
    <GestureDetector gesture={gestureHandler}>
      <View className='flex flex-row absolute bottom-0 h-1/4 items-end justify-center pb-6 w-full'>
        <Animated.View
          style={animatedStyle}
          onLayout={handleLayout}
          className='mx-auto min-w-fit mt-8 flex flex-row items-center justify-between'
        >
          <AnimatedBlurView
            intensity={60}
            tint={colorScheme === "light" ? "dark" : "light"}
            className={cn(
              "absolute top-0 left-0 right-0 bottom-0 overflow-hidden",
              photo || video ? "rounded-[3rem]" : "rounded-[5rem]"
            )}
          />
          {photo || video ? (
            <View className='absolute top-5 inset-x-12 flex flex-row items-center justify-center'>
              <TouchableOpacity
                className=' z-20'
                onPress={() => {
                  setPhoto("");
                  setVideo("");
                }}
              >
                <ArrowLeft size={17} strokeWidth={2} className='text-white' />
              </TouchableOpacity>

              <TabBarText className='!text-lg !text-start !mt-0 '>
                Edit
              </TabBarText>

              <TouchableOpacity
                className='z-20'
                onPress={async () => await shareAsync(photo || video)}
              >
                <Share size={17} strokeWidth={2} className='text-white' />
              </TouchableOpacity>
            </View>
          ) : null}

          {!photo && !video && (
            <AnimatedBlurView
              style={tabpillHighlightStyle}
              className='absolute left-0 w-[135] h-[60] rounded-full overflow-hidden flex-row items-center justify-center'
            ></AnimatedBlurView>
          )}
          {!photo && !video
            ? state.routes.map((route: any, index: number) => (
                <TabBarIcon
                  animatedIsExpanded={animatedIsExpanded}
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
            : PRESET_OPTIONS.map((w, idx) => (
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
