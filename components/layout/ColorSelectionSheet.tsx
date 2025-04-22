import Slider from "@react-native-community/slider";
import { cx } from "class-variance-authority";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { Pen } from "~/lib/icons/Pen";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {};
const { width } = Dimensions.get("screen");
const GRADIENT_BOX_WIDTH = width - 55;

const ColorSelectionSheet = (props: Props) => {
  const colors: [string, string, ...string[]] = [
    "#FFC0CB", // Light Pink
    "#D8BFD8", // Thistle
    "#ADD8E6", // Light Blue
    "#B0E0E6", // Powder Blue
    "#90EE90", // Light Green
    "#F0E68C", // Khaki
    "#FFA07A", // Light Salmon
    "#FFFFFF", // White
    "#D3D3D3", // Light Gray
  ];

  const backgroundColor = useSharedValue<string>(colors[0]);

  const inputRange = colors.map(
    (_, index) => (index / colors.length) * GRADIENT_BOX_WIDTH
  );

  const pan = Gesture.Pan()
    .onStart((event) => {
      backgroundColor.value = interpolateColor(
        event.translationX,
        inputRange,
        colors
      );
    })
    .onEnd((event) => {
      backgroundColor.value = interpolateColor(
        event.translationX,
        inputRange,
        colors
      );
    });

  const tap = Gesture.Tap()
    .onStart((event) => {
      backgroundColor.value = interpolateColor(
        event.absoluteX,
        inputRange,
        colors
      );
    })
    .onEnd((event) => {
      backgroundColor.value = interpolateColor(
        event.absoluteX,
        inputRange,
        colors
      );
    });

  const gesture = Gesture.Race(tap, pan);
  const selectedColorStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor.value };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="px-8 flex flex-col items-start justify-center gap-8">
        <GestureDetector gesture={gesture}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex items-center justify-center flex-row"
            style={[
              {
                height: 120,
                width: GRADIENT_BOX_WIDTH,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Animated.Text className="text-muted-foreground/40 text-lg font-semibold">
              Press and drag
            </Animated.Text>
          </LinearGradient>
        </GestureDetector>

        <View className="flex flex-row gap-3 items-center justify-center">
          <Animated.View
            style={selectedColorStyle}
            className={cx(
              "w-16 h-16 rounded-full flex items-center justify-center "
            )}
          >
            <Pen strokeWidth={2} size={24} className="text-white" />
          </Animated.View>

          <ScrollView
            horizontal
            contentContainerStyle={{
              gap: 12,
            }}
          >
            {colors.map((i) => (
              <View
                key={i}
                style={{ backgroundColor: i }}
                className={cx("w-12 h-12 rounded-full")}
              />
            ))}
          </ScrollView>
        </View>
        <View>
          <Animated.Text className="text-muted-foreground text-lg text-center font-semibold">
            Stroke width
          </Animated.Text>

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
