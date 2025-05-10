import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import {
  DashPathEffect,
  DiscretePathEffect,
  LinearGradient as SkiaLinearGradient,
} from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "~/lib/icons/Plus";
import { Signature } from "~/lib/icons/Signature";
import { CircleDashed } from "~/lib/icons/CircleDashed";
import { Circle } from "~/lib/icons/Circle";

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
  runOnJS,
  useAnimatedReaction,
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
import { cn } from "~/lib/utils";
import { Plug } from "lucide-react-native";
import { Canvas, FitBox, Path, rect, vec } from "@shopify/react-native-skia";
import { Muted, Small } from "../ui/typography";
import { Separator } from "../ui/separator";

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
  const [strokeWidthState, setstrokeWidthState] = useState<number>(0);

  const strokeWidth = useSharedValue(25);

  // UI thread to JS thread
  useAnimatedReaction(
    () => strokeWidth.value,
    (e) => {
      runOnJS(setstrokeWidthState)(e);
    }
  );

  const changeStrokeWidth = (e: number) => {
    strokeWidth.value = e;
  };

  const TEXT = "Press and drag";

  // variables to draw x axis ticks
  const max = 12;
  const skipInterval = 2;
  const ticks = [...Array(max + 1)].map((_, i) => i);

  // animation progress
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

  // Vibrate once after first drag
  useAnimatedReaction(
    () => isDrag.value,
    () => {
      if (isDrag.value) {
        runOnJS(triggerHaptic)();
      }
    },
    [isDrag]
  );

  const gesture = Gesture.Simultaneous(hold, pan);

  const selectedColorStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor.value };
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([colors[0]]);

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

  const discretePathDeviation = useDerivedValue(() =>
    interpolate(strokeWidth.value, [0, 48], [10, 2])
  );
  const dashPathEffectIntervals = useDerivedValue(() =>
    interpolate(strokeWidth.value, [0, 48], [5, 50])
  );

  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

  const toggleSelectedEffects = useCallback((e: "discrete" | "dash") => {
    setSelectedEffects((prev) =>
      prev.includes(e) ? prev.filter((effect) => effect !== e) : [...prev, e]
    );
  }, []);

  const getStyleForEffect = (e: "discrete" | "dash") =>
    useAnimatedStyle(() => {
      const display = selectedEffects.includes(e);
      return {
        borderWidth: withTiming(display ? 2 : 0),
      };
    }, [selectedEffects]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className='w-full  px-8 flex items-center justify-center flex-row'>
          <Canvas style={{ width: GRADIENT_BOX_WIDTH, height: 135 }}>
            <FitBox
              src={rect(0, -30, 300, 120)}
              dst={rect(0, 0, GRADIENT_BOX_WIDTH, 120)}
            >
              <Path
                path='M 10 40 C 80 90, 120 90, 150 40 S 220 -10, 290 40'
                strokeCap='round'
                strokeJoin='round'
                style='stroke'
                color={"black"}
                strokeWidth={strokeWidth.get()}
              >
                {selectedEffects.includes("discrete") && (
                  <DiscretePathEffect
                    length={10}
                    deviation={discretePathDeviation.get()}
                  />
                )}
                {selectedEffects.includes("dash") && (
                  <DashPathEffect
                    intervals={[
                      dashPathEffectIntervals.get(),
                      dashPathEffectIntervals.get(),
                    ]}
                  />
                )}
                <SkiaLinearGradient
                  start={vec(0, 0)}
                  end={vec(GRADIENT_BOX_WIDTH, 120)}
                  colors={selectedColors}
                />
              </Path>
            </FitBox>
          </Canvas>
        </View>
        {/* Vertical spacing */}
        <Separator className='mt-2 mb-6' />
        <View className='flex-1 px-8 flex-col items-center justify-center'>
          {/* Vertical spacing */}
          <View className='gap-6 flex-1'>
            <GestureDetector gesture={gesture}>
              <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className='flex overflow-hidden relative'
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
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center absolute border-2 border-white"
                  )}
                />
                <View className=' absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transform flex flex-row justify-center-center items-center'>
                  {TEXT.split("").map((char, idx) => {
                    const style = useAnimatedStyle(() => {
                      const charProgress = interpolate(
                        progress.value,
                        [0, 100],
                        [0, TEXT.length]
                      );

                      const distanceFromProgress = Math.abs(charProgress - idx);
                      const waveFactor = Math.max(
                        1 - distanceFromProgress / 4,
                        0
                      );

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

            <View className='flex flex-row items-center justify-between w-full'>
              <View className='flex flex-row gap-3 items-center justify-center'>
                <TouchableBounce
                  onPress={() => {
                    setSelectedColors((prev) => [
                      ...prev,
                      backgroundColor.value,
                    ]);
                  }}
                  sensory
                >
                  <Animated.View
                    style={selectedColorStyle}
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center border-2 dark:border-white border-muted-foreground"
                    )}
                  >
                    <Plus strokeWidth={2} size={30} className='text-white' />
                  </Animated.View>
                </TouchableBounce>

                <Text className='text-muted-foreground text-lg text-center font-semibold'>
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
                  className='text-muted-foreground'
                />
              </TouchableBounce>
            </View>
          </View>
          {/* Vertical spacing */}

          <Separator className='my-6 flex-1' />
          <View className='flex-1'>
            <View className='text-start flex-row w-full items-center justify-between'>
              <View className='h-full flex flex-row items-center justify-start w-2/6'>
                <Muted className=' text-lg font-semibold'>Stroke width</Muted>
              </View>

              <View className='w-4/6'>
                <Slider
                  value={strokeWidthState}
                  onValueChange={(e) => {
                    changeStrokeWidth(e);
                  }}
                  minimumValue={0}
                  maximumValue={48}
                  minimumTrackTintColor='#FFFFFF'
                  maximumTrackTintColor='#000000'
                />

                <View className='mt-1 flex flex-row w-full items-center justify-between gap-1 px-2.5 text-xs font-medium text-muted-foreground'>
                  {ticks.map((_, i) => (
                    <View
                      key={i}
                      className='flex w-0 flex-col items-center justify-center gap-2'
                    >
                      <View
                        className={cn(
                          "h-2 w-px bg-muted-foreground/70",
                          i % skipInterval !== 0 && "h-1"
                        )}
                      />
                      <View
                        className={cn(i % skipInterval !== 0 && "opacity-0")}
                      ></View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
          {/* Vertical spacing */}
          <Separator className='my-6 flex-1' />

          <View className='text-start flex-1 flex-row w-full items-center justify-between'>
            <View className='h-full flex flex-row items-center justify-start w-2/6'>
              <Muted className=' text-lg font-semibold'>Stroke style</Muted>
            </View>

            <View className='w-4/6'>
              <View className='w-full flex items-center justify-start gap-3 flex-row'>
                <TouchableBounce
                  sensory
                  onPress={() => {
                    toggleSelectedEffects("discrete");
                  }}
                >
                  <Animated.View
                    style={getStyleForEffect("discrete")}
                    className=' border-slate-400 rounded-2xl w-14 h-16 text-muted-foreground flex items-center justify-center'
                  >
                    <Signature
                      strokeWidth={2}
                      size={30}
                      className='text-muted-foreground'
                    />
                  </Animated.View>
                </TouchableBounce>

                <Separator orientation='vertical' />

                <TouchableBounce
                  sensory
                  onPress={() => {
                    toggleSelectedEffects("dash");
                  }}
                >
                  <Animated.View
                    style={getStyleForEffect("dash")}
                    className=' border-slate-400 rounded-2xl w-14 h-16 text-muted-foreground flex items-center justify-center'
                  >
                    <CircleDashed
                      strokeWidth={2}
                      size={30}
                      className='text-muted-foreground'
                    />
                  </Animated.View>
                </TouchableBounce>
              </View>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default ColorSelectionSheet;
