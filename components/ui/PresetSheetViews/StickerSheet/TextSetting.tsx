import React, { Fragment, useEffect, useState } from "react";
import { Dimensions, View, Text, ScrollView } from "react-native";
import Animated, {
  FadeInRight,
  FadeOutRight,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GLOBALS_SINGLE_STICKER_OPTIONS } from "~/store/globalStore";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Separator } from "../../separator";
import { Canvas, useFont, Text as SkText } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import DottedBackground from "../../DottedBackground";
import TouchableBounce from "../../TouchableBounce";
const { width } = Dimensions.get("screen");
import { Trash2, Plus } from "~/lib/icons";
import { cn } from "~/lib/utils";
import { colors, FONT_TO_FONTNAMES, FONTS } from "~/lib/constants";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { Muted } from "../../typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "~/lib/useColorScheme";
import GlitchText from "../../Stickers/Glitch";
import { CenteredSkiaContent } from "../../LegendListColumnCenter";
import EdgeFade from "../../EdgeFade";
const TEXT_PILL_HEIGHT = 60;
const TEXT_SCALE = 0.7;
const GRADIENT_BOX_WIDTH = width - 55;
type Props = {
  setSelected: React.Dispatch<
    React.SetStateAction<GLOBALS_SINGLE_STICKER_OPTIONS | undefined>
  >;
  selected: GLOBALS_SINGLE_STICKER_OPTIONS | undefined;
};

const TEXT = "Press and drag";

function TextSetting({ setSelected, selected }: Props) {
  const isDrag = useSharedValue<boolean>(false);

  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);
  const { colorScheme } = useColorScheme();

  const inputRange = colors.map(
    (_, index) => (index / colors.length) * GRADIENT_BOX_WIDTH
  );
  const backgroundColor = useSharedValue<string>(colors[0]);

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

  const gesture = Gesture.Simultaneous(hold, pan);

  const movingColorIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isDrag.get() ? 1 : 0),
      backgroundColor: backgroundColor.get(),
      transform: [
        {
          translateX: currentX.get() - 30,
        },
        {
          translateY: currentY.get() - 65,
        },
      ],
    };
  });

  const [selectedColors, setSelectedColors] = useState<string[]>([colors[0]]);
  const selectedColorStyle = useAnimatedStyle(() => {
    return { backgroundColor: backgroundColor.get() };
  });

  // animation progress
  const progress = useSharedValue<number>(0);

  useEffect(() => {
    progress.set(
      withRepeat(
        withSequence(
          withTiming(100, {
            duration: 2200,
          }),
          withTiming(0, {
            duration: 2000,
          })
        ),
        -1
      )
    );
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        paddingBottom: 100,
      }}
    >
      <Animated.View
        entering={FadeInRight.delay(100)}
        exiting={FadeOutRight.delay(100)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View className='w-full  px-8 flex items-center justify-center flex-row'>
            <Canvas style={{ width: GRADIENT_BOX_WIDTH, height: 135 }}>
              <GlitchText
                xCord={90}
                yCord={100}
                fontName='Got_Heroin'
                fontSize={135}
                text='Glitch'
              />
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
                          progress.get(),
                          [0, 100],
                          [0, TEXT.length]
                        );

                        const distanceFromProgress = Math.abs(
                          charProgress - idx
                        );
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
                        backgroundColor.get(),
                      ]);
                    }}
                    sensory
                  >
                    <Animated.View
                      style={selectedColorStyle}
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center border-2 dark:border-white border-muted-foreground"
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

            <Separator className='my-6 flex-1' />

            <View className='flex-1 flex-col w-full items-start justify-center gap-2 relative'>
              <View className='flex flex-1 flex-row items-center justify-start '>
                <Muted className='text-lg font-semibold'>Font</Muted>
              </View>

              <EdgeFade height={44} width={90} position='left' />

              <ScrollView
                horizontal
                contentContainerStyle={{
                  gap: 20,
                  height: "auto",
                }}
                style={{
                  borderRadius: 30,
                }}
                showsHorizontalScrollIndicator={false}
              >
                {Object.keys(FONTS).map((e: string, idx) => {
                  const fontSize =
                    FONT_TO_FONTNAMES[e as keyof typeof FONT_TO_FONTNAMES].size;
                  const yOffshootDividend =
                    FONT_TO_FONTNAMES[e as keyof typeof FONT_TO_FONTNAMES]
                      .yOffshootDividend;
                  const text =
                    FONT_TO_FONTNAMES[e as keyof typeof FONT_TO_FONTNAMES].name;
                  const font = useFont(
                    FONTS[e as keyof typeof FONTS],
                    fontSize
                  );
                  if (!font || font === null) {
                    return <Fragment key={idx}></Fragment>;
                  }
                  const textWidth = font ? font.getTextWidth(text) + 30 : 160;
                  return (
                    <Canvas
                      key={idx}
                      style={{
                        flex: 1,
                        width: textWidth * TEXT_SCALE,
                        height: TEXT_PILL_HEIGHT * TEXT_SCALE,
                        backgroundColor:
                          colorScheme === "light" ? "white" : "black",
                        borderRadius: 24,
                      }}
                      className='rounded-3xl overflow-hidden'
                    >
                      <CenteredSkiaContent
                        scale={TEXT_SCALE}
                        width={textWidth}
                        height={TEXT_PILL_HEIGHT}
                      >
                        <SkText
                          font={font}
                          color={
                            colorScheme === "dark"
                              ? "rgba(242.25, 242.25, 247.35, 1)"
                              : "rgba(43.35, 43.35, 46.35, 1)"
                          }
                          text={text}
                          x={-textWidth / 2 + 10} // Offset by half text width
                          y={fontSize / yOffshootDividend} // Slight vertical adjustment
                          opacity={0.9}
                        />
                      </CenteredSkiaContent>
                    </Canvas>
                  );
                })}
              </ScrollView>

              <EdgeFade height={44} width={90} position='right' />
            </View>
          </View>
        </GestureHandlerRootView>
      </Animated.View>
    </ScrollView>
  );
}

export default TextSetting;
