import { LegendList } from "@legendapp/list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { Settings2 } from "~/lib/icons/Settings2";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  Easing,
  EntryAnimationsValues,
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
  ZoomInLeft,
  ZoomInRight,
  ZoomOutLeft,
  ZoomOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import EdgeFade from "~/components/ui/EdgeFade";
import GalleryItems from "~/components/ui/GalleryItems";
import { Overlay } from "~/components/ui/gradient/overlay";
import LegendListColumnCenter from "~/components/ui/LegendListColumnCenter";
import { blurhash } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import TouchableBounce from "~/components/ui/TouchableBounce";
import { Button } from "~/components/ui/button";
import {
  Canvas,
  Rect,
  useImage,
  Image as SkImage,
  SkImage as SkImageType,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");

const headerHeight = height / 1.8;
const layoutMap: Record<
  number,
  { x: number; y: number; width: number; height: number; depth: number }
> = {
  0: { x: 0.05, y: 0.2, width: 0.16, height: 0.16, depth: 4 },
  1: { x: 0.3, y: 0.13, width: 0.3, height: 0.13, depth: 1 },
  2: { x: 0.6, y: 0.25, width: 0.14, height: 0.18, depth: 2 },
  3: { x: 0.85, y: 0.1, width: 0.2, height: 0.28, depth: 5 },
  4: { x: 0.9, y: 0.35, width: 0.16, height: 0.16, depth: 1 },
  5: { x: 0.72, y: 0.55, width: 0.18, height: 0.16, depth: 6 },
  6: { x: -0.05, y: 0.38, width: 0.28, height: 0.12, depth: 12 },
  7: { x: 0.02, y: 0.55, width: 0.25, height: 0.25, depth: 1 },
  8: { x: 0.25, y: 0.73, width: 0.16, height: 0.18, depth: 32 },
  9: { x: 0.9, y: 0.7, width: 0.15, height: 0.16, depth: 21 },
  10: { x: 0.4, y: 0.6, width: 0.2, height: 0.18, depth: 26 },
  11: { x: 0.75, y: 0.87, width: 0.2, height: 0.18, depth: 18 },
};

const imagesArr = Array.from({ length: 12 }, (_, idx) => {
  const layout = layoutMap[idx];
  const imageFromWeb = `https://picsum.photos/seed/${idx * 5}/3000/2000`;

  return {
    x: layout.x * width,
    y: layout.y * headerHeight,
    depth: layout.depth,
    width: layout.width * width,
    height: layout.height * headerHeight,
    image: imageFromWeb,
  };
});

const getRandomVector = (x: number, y: number, depth: number) => {
  "worklet";
  const seedX = Math.sin(x * 0.134 + y * 0.345 + depth * 0.678) * 10000;
  const seedY = Math.sin(x * 0.984 + y * 0.123 + depth * 0.456) * 10000;

  // Values between -1 and 1, scaled for movement range
  const randomX = ((seedX - Math.floor(seedX)) * 2 - 1) * 5; // tweak 1.5 for spread
  const randomY = ((seedY - Math.floor(seedY)) * 2 - 1) * 5;

  return { randomX, randomY };
};

const useBreathing = (x: number, y: number, depth: number) => {
  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(Math.random() * 0.15 * 50, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true // reverse
    );
  }, []);

  return breath;
};

type Props = {};
function GalleryPage({}: Props) {
  const LegendListRef = useRef<ScrollView>(null);
  const [initialScrollToTop, setInitialScrollToTop] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (LegendListRef.current && !initialScrollToTop) {
      timeout = setTimeout(() => {
        if (LegendListRef.current) {
          LegendListRef.current.scrollTo({ x: 0, y: 0.4, animated: true });
          setInitialScrollToTop(true);
        }
      }, 500);
    }
    () => clearTimeout(timeout);
  }, [LegendListRef.current]);

  const scrollYOffset = useSharedValue<number>(0);
  const [showTopEdgeFade, setshowTopEdgeFade] = useState(false);
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYOffset.set(e.nativeEvent.contentOffset.y);
      if (e.nativeEvent.contentOffset.y > headerHeight - 100) {
        setshowTopEdgeFade(true);
      } else {
        setshowTopEdgeFade(false);
      }
    },
    []
  );

  const HeaderAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollYOffset.value,
      [0, headerHeight],
      [0, -headerHeight],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }],
    };
  });

  const { colorScheme } = useColorScheme();

  const textEntering = (_targetValues: EntryAnimationsValues) => {
    "worklet";
    const animations = {
      opacity: withDelay(800, withTiming(1, { duration: 880 })),
      transform: [
        { translateY: withDelay(800, withTiming(0, { duration: 880 })) },
      ],
    };
    const initialValues = {
      opacity: 0,
      transform: [{ translateY: 0 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  const ImageStyle = (
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number
  ) => {
    const breath = useBreathing(x, y, depth);

    return useAnimatedStyle(() => {
      const { randomX, randomY } = getRandomVector(x, y, depth);

      const scrollFactor = interpolate(
        scrollYOffset.get(),
        [0, headerHeight],
        [0, 50], // how far they move
        Extrapolation.CLAMP
      );

      return {
        position: "absolute",
        top: y,
        left: x,
        width: width,
        height: height,
        transform: [
          {
            translateX: withSpring(
              scrollFactor * randomX * depth + breath.get(),
              {
                damping: 10 + Math.abs(randomX) * depth * 5,
              }
            ),
          },
          {
            translateY: withSpring(
              scrollFactor * randomY * depth + breath.get(),
              {
                damping: 10 + Math.abs(randomY) * depth * 5,
              }
            ),
          },
        ],
      };
    });
  };

  const [selectedImage, setSelectedImage] = useState<
    | {
        x: number;
        y: number;
        depth: number;
        width: number;
        height: number;
        image: string;
      }
    | undefined
  >(undefined);

  const gestureHandler = Gesture.Tap().onEnd((e) => {
    const tapX = e.x;
    const tapY = e.y;
    if (tapY > headerHeight - 50) return;

    let closestImage = null;
    let minDistance = Infinity;

    for (const img of imagesArr) {
      const centerX = img.x + img.width / 2;
      const centerY = img.y + img.height / 2;

      const dx = centerX - tapX;
      const dy = centerY - tapY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestImage = img;
      }
    }

    if (closestImage) {
      runOnJS(setSelectedImage)(closestImage);
    }
  });

  const [tabs, setTabs] = useState<"all" | "favorites">("all");

  return (
    <View className="flex-1">
      {tabs === "all" && !selectedImage ? (
        <Animated.View
          layout={LinearTransition}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
          style={[{ flex: 1 }]}
          className="relative"
        >
          {showTopEdgeFade ? (
            <EdgeFade position="top" width={width} height={100} />
          ) : (
            <></>
          )}

          <GestureDetector gesture={gestureHandler}>
            <Animated.View
              className="w-full flex items-center justify-center relative"
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: headerHeight,
                  zIndex: 9999,
                  overflow: "hidden",
                },
                HeaderAnimatedStyle,
              ]}
            >
              <EdgeFade height={200} width={width} position="top" />
              <EdgeFade
                height={200}
                width={width}
                style={{ bottom: -2, borderRadius: 0 }}
                position="bottom"
              />
              <EdgeFade
                height={headerHeight}
                width={50}
                position="left"
                style={{ borderRadius: 0 }}
              />
              <EdgeFade
                height={headerHeight}
                width={50}
                style={{ borderRadius: 0 }}
                position="right"
              />

              <Animated.View
                className="z-50 text-center space-y-4 items-center flex flex-col"
                entering={textEntering}
              >
                <Text className="text-base text-black/70 dark:text-white">
                  Recent
                </Text>

                <Text className="text-5xl md:text-7xl text-black/70 dark:text-white font-calendas italic">
                  favorites.
                </Text>
              </Animated.View>

              {imagesArr.map((props, idx) => (
                <GalleryImage
                  key={idx}
                  {...props}
                  scrollYOffset={scrollYOffset}
                />
              ))}

              <View className="absolute bottom-2 left-0 w-full z-[9999] space-y-2">
                <View className="flex w-full items-center justify-start px-4 gap-4 flex-row mt-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-xl "
                    onPress={() => {
                      setTabs("all");
                    }}
                  >
                    <Text className="text-base text-center dark:text-black/70 text-white">
                      All Photos
                    </Text>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-none"
                    onPress={() => {
                      setTabs("favorites");
                    }}
                  >
                    <Text className="text-base text-center text-black/70 dark:text-white">
                      Favorites Only
                    </Text>
                  </Button>
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
          {/* LegendList: Static, but content starts below header */}
          <LegendList
            refScrollView={LegendListRef}
            onScroll={handleScroll}
            keyExtractor={(item) => `${item}_me`}
            style={{
              flex: 1,
              width: width,
              height: height,
              paddingHorizontal: 4,
              zIndex: 10,
            }}
            bounces={false}
            contentContainerStyle={{
              paddingTop: headerHeight - 2,
              paddingBottom: 50,
            }}
            numColumns={2}
            estimatedItemSize={50}
            recycleItems
            data={Array.from({ length: 10 }, (_, i) => i)}
            renderItem={({ index }) => (
              <LegendListColumnCenter index={index} numColumns={2}>
                <View
                  className=" my-[2px] rounded-3xl overflow-hidden"
                  style={{ width: width / 2 - 6, height: width / 2 + 100 }}
                >
                  <Image
                    style={{
                      backgroundColor: "#d1d5db",
                      flex: 1,
                    }}
                    source={`https://picsum.photos/seed/${
                      index + 10
                    }/3000/2000`}
                    contentFit="cover"
                    placeholder={blurhash}
                    transition={1000}
                  />
                </View>
              </LegendListColumnCenter>
            )}
          ></LegendList>

          <BlurView
            className="h-10 w-20 rounded-full absolute top-16 right-5 overflow-hidden flex items-center justify-center z-[9999]"
            intensity={60}
            tint={colorScheme === "light" ? "dark" : "light"}
          >
            <Text className="text-base text-center text-white">Select</Text>
          </BlurView>

          <BlurView
            className="h-10 w-10 rounded-full absolute top-16 right-28 overflow-hidden flex items-center justify-center z-[9999]"
            intensity={60}
            tint={colorScheme === "light" ? "dark" : "light"}
          >
            <Settings2 strokeWidth={2} size={18} className="text-white " />
          </BlurView>

          <EdgeFade position="bottom" width={width} height={100} />
        </Animated.View>
      ) : tabs === "favorites" && !selectedImage ? (
        <Animated.View
          layout={LinearTransition}
          entering={ZoomInRight.duration(1000)}
          exiting={ZoomOutRight.duration(1000)}
          style={[{ flex: 1 }]}
          className="relative"
        >
          <SafeAreaView className="flex-1 justify-center items-center gap-4 px-5">
            <BlurView
              className="h-10 w-10 rounded-full absolute top-16 left-5 overflow-hidden flex items-center justify-center z-[9999]"
              intensity={60}
              onTouchEnd={() => {
                setTabs("all");
                setSelectedImage(undefined);
              }}
              tint={colorScheme === "light" ? "dark" : "light"}
            >
              <ChevronUp
                strokeWidth={2}
                size={30}
                className="text-white -rotate-90"
              />
            </BlurView>
            <Text className="opacity-0"></Text>
            <GalleryItems />
            <View style={{ width, height, zIndex: -100, position: "absolute" }}>
              <Overlay />
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : (
        <Animated.View
          layout={LinearTransition}
          key={selectedImage ? "key" : "triggerChange"}
          entering={ZoomInLeft.duration(1000)}
          exiting={ZoomOutLeft.duration(1000)}
          style={[{ flex: 1 }]}
          className="relative"
        >
          <BlurView
            className="h-10 w-10 rounded-full absolute top-16 left-5 overflow-hidden flex items-center justify-center z-[9999]"
            intensity={60}
            onTouchEnd={() => {
              setTabs("all");
            }}
            tint={colorScheme === "light" ? "dark" : "light"}
          >
            <ChevronUp
              strokeWidth={2}
              onTouchEnd={() => {
                setSelectedImage(undefined);
              }}
              size={30}
              className="text-white -rotate-90"
            />
          </BlurView>

          <Image
            style={{ backgroundColor: "#d1d5db", flex: 1 }}
            source={selectedImage?.image}
            contentFit="contain"
            placeholder={blurhash}
            transition={1000}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default GalleryPage;

function GalleryImage({
  x,
  y,
  width,
  height,
  depth,
  image,
  scrollYOffset,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  image: string;
  scrollYOffset: SharedValue<number>;
}) {
  const breath = useBreathing(x, y, depth);

  const animatedStyle = useAnimatedStyle(() => {
    const { randomX, randomY } = getRandomVector(x, y, depth);

    const scrollFactor = interpolate(
      scrollYOffset.value,
      [0, headerHeight],
      [0, 50],
      Extrapolation.CLAMP
    );

    return {
      position: "absolute",
      top: y,
      left: x,
      width: width,
      height: height,
      transform: [
        {
          translateX: withSpring(
            scrollFactor * randomX * depth + breath.value,
            {
              damping: 10 + Math.abs(randomX) * depth * 5,
            }
          ),
        },
        {
          translateY: withSpring(
            scrollFactor * randomY * depth + breath.value,
            {
              damping: 10 + Math.abs(randomY) * depth * 5,
            }
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[animatedStyle]}
      className="rounded-xl overflow-hidden"
    >
      <Image
        style={{ backgroundColor: "#d1d5db", flex: 1 }}
        source={image}
        contentFit="cover"
        placeholder={blurhash}
        transition={1000}
      />
    </Animated.View>
  );
}
