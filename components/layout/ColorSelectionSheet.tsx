import Slider from "@react-native-community/slider";
import { cx } from "class-variance-authority";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "~/lib/icons/Plus";
import { Trash2 } from "~/lib/icons/Trash2";

import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  LinearTransition,
  RollInLeft,
  RollOutRight,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import DottedBackground from "../ui/DottedBackground";
import TouchableBounce from "../ui/TouchableBounce";
import TextWithHorizontalRule from "../ui/TextWithHorizontalRule";

type Props = {};
const { width } = Dimensions.get("screen");
const GRADIENT_BOX_WIDTH = width - 55;

const ColorSelectionSheet = (props: Props) => {
  const colors: [string, string, ...string[]] = [
    "#FF69B4", // Hot Pink
    "#FF6B6B", // Coral Red
    "#FF8C42", // Dark Orange
    "#FFA726", // Orange
    "#66BB6A", // Light Green
    "#4FC3F7", // Light Blue
    "#7986CB", // Blue Grey
    "#BA68C8", // Purple
    "#F06292", // Pink
    "#4DB6AC", // Teal
    "#9575CD", // Deep Purple
    "#FF7043", // Deep Orange
    "#FFB74D", // Amber
    "#4DD0E1", // Cyan
    "#81C784", // Green
    "#7E57C2", // Deep Purple
    "#FF8A65", // Deep Orange
  ];

  const TEXT = "Press and drag";

  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(100, {
          duration: 2200,
        }),
        withTiming(0, {
          duration: 2000,
        })
      ),
      -1
    );
  }, []);

  const backgroundColor = useSharedValue<string>(colors[0]);

  const inputRange = colors.map(
    (_, index) => (index / colors.length) * GRADIENT_BOX_WIDTH
  );

  const isDrag = useSharedValue<boolean>(false);

  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);

  const hold = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      isDrag.value = true;
    });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .maxPointers(1)
    .onBegin((e) => {
      currentX.value = e.x;
      currentY.value = e.y;
      if (isDrag.value) {
        backgroundColor.value = interpolateColor(e.x, inputRange, colors);
      }
    })
    .onChange((e) => {
      currentX.value = e.x;
      currentY.value = e.y;
      if (isDrag.value) {
        backgroundColor.value = interpolateColor(e.x, inputRange, colors);
      }
    })
    .onEnd(() => {
      isDrag.value = false;
    });

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useDerivedValue(() => {
    if (isDrag.value) {
      runOnJS(triggerHaptic)();
    }
  }, [isDrag]);

  const gesture = Gesture.Simultaneous(hold, pan);

  const selectedColorStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor.value };
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const movingColorIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isDrag.value ? 1 : 0),
      backgroundColor: backgroundColor.value,
      transform: [
        {
          translateX: currentX.value - 30,
        },
        {
          translateY: currentY.value - 65,
        },
      ],
    };
  });

  console.log(selectedColors);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="px-8 flex flex-col items-start justify-center gap-8">
        <GestureDetector gesture={gesture}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex overflow-hidden relative"
            style={[
              {
                height: 140,
                width: GRADIENT_BOX_WIDTH,
                borderRadius: 24,
              },
            ]}
          >
            <Animated.View
              style={movingColorIndicatorStyle}
              className={cx(
                "w-12 h-12 rounded-full flex items-center justify-center absolute border-2 border-white"
              )}
            />
            <View className=" absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transform flex flex-row justify-center-center items-center">
              {TEXT.split("").map((char, idx) => {
                const style = useAnimatedStyle(() => {
                  const charProgress = interpolate(
                    progress.value,
                    [0, 100],
                    [0, TEXT.length]
                  );

                  const distanceFromProgress = Math.abs(charProgress - idx);
                  const waveFactor = Math.max(1 - distanceFromProgress / 4, 0);

                  const color = interpolateColor(
                    waveFactor,
                    [0, 1],
                    ["#6b7280cc", "white"]
                  );

                  return {
                    color,
                  };
                });

                return (
                  <Animated.Text
                    key={idx}
                    className={"text-2xl font-bold"}
                    style={style}
                  >
                    {char}
                  </Animated.Text>
                );
              })}
            </View>
            <DottedBackground />
          </LinearGradient>
        </GestureDetector>

        <View className="w-full flex-col flex items-start justify-start gap-3">
          <View className="flex flex-row items-center justify-between w-full">
            <View className="flex flex-row gap-3 items-center justify-center">
              <TouchableBounce
                onPress={() => {
                  setSelectedColors((prev) => [...prev, backgroundColor.value]);
                }}
                sensory
              >
                <Animated.View
                  style={selectedColorStyle}
                  className={cx(
                    "w-16 h-16 rounded-full flex items-center justify-center "
                  )}
                >
                  <Plus strokeWidth={2} size={30} className="text-white" />
                </Animated.View>
              </TouchableBounce>

              <Text className="text-muted-foreground text-lg text-center font-semibold">
                Add colors
              </Text>
            </View>

            <TouchableBounce
              onPress={() => {
                setSelectedColors((prev) => prev.slice(0, -1));
              }}
              sensory
            >
              <Trash2
                strokeWidth={2}
                size={30}
                className="text-muted-foreground"
              />
            </TouchableBounce>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 12,
              minWidth: GRADIENT_BOX_WIDTH,
            }}
          >
            {selectedColors.map((i, idx) => (
              <Animated.View
                layout={LinearTransition}
                entering={RollInLeft.duration(500)}
                exiting={RollOutRight.duration(600)}
                key={idx}
                style={{ backgroundColor: i }}
                className={cx("w-12 h-12 rounded-full")}
              />
            ))}
          </ScrollView>
        </View>
        <View>
          <TextWithHorizontalRule text="Stroke Width"></TextWithHorizontalRule>

          <Slider
            style={{ width: GRADIENT_BOX_WIDTH, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default ColorSelectionSheet;
