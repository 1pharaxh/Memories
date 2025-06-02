import { LegendList } from "@legendapp/list";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { Settings2 } from "~/lib/icons/Settings2";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";

import Animated, {
  clamp,
  EntryAnimationsValues,
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
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
const { width, height } = Dimensions.get("screen");

const headerHeight = height / 1.8;
const centerX = width / 2;
const centerY = headerHeight / 2;
const layoutMap: Record<
  number,
  { x: number; y: number; width: number; height: number }
> = {
  0: { x: 0.1, y: 0.18, width: 0.18, height: 0.18 },
  1: { x: 0.35, y: 0.05, width: 0.4, height: 0.15 },
  2: { x: 0.7, y: 0.1, width: 0.16, height: 0.2 },
  3: { x: 0.8, y: 0.3, width: 0.22, height: 0.22 },
  4: { x: 0.75, y: 0.55, width: 0.18, height: 0.22 },
  5: { x: 0.6, y: 0.75, width: 0.2, height: 0.18 },
  6: { x: 0.35, y: 0.78, width: 0.22, height: 0.2 },
  7: { x: 0.1, y: 0.7, width: 0.2, height: 0.22 },
  8: { x: 0.05, y: 0.45, width: 0.18, height: 0.2 },
  9: { x: 0.25, y: 0.28, width: 0.16, height: 0.18 },
  10: { x: 0.6, y: 0.25, width: 0.18, height: 0.2 },
  11: { x: 0.45, y: 0.65, width: 0.18, height: 0.18 },
};
const numImages = 12;

type Props = {};
function GalleryPage({}: Props) {
  const LegendListRef = useRef<ScrollView>(null);
  const [initialScrollToTop, setInitialScrollToTop] = useState<boolean>(false);

  const imagesArr = Array.from({ length: 12 }, (_, idx) => {
    const layout = layoutMap[idx];
    const imageFromWeb = useImage(
      `https://picsum.photos/seed/${idx * 5}/3000/2000`
    );

    return {
      x: layout.x * width,
      y: layout.y * headerHeight,
      width: layout.width * width,
      height: layout.height * headerHeight,
      image: imageFromWeb as SkImageType,
    };
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (LegendListRef.current && !initialScrollToTop) {
      timeout = setTimeout(() => {
        if (LegendListRef.current) {
          LegendListRef.current.scrollTo({ x: 0, y: 0, animated: true });
          setInitialScrollToTop(true);
          console.log("I RAN");
        }
      }, 500);
    }
    () => clearTimeout(timeout);
  }, [LegendListRef.current]);

  const scrollYOffset = useSharedValue<number>(0);
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYOffset.set(e.nativeEvent.contentOffset.y);
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

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={[{ flex: 1 }]}
      className='relative'
    >
      {/* <SafeAreaView className='flex-1 justify-center items-center gap-4 px-5'>
        <Text className='opacity-0'></Text>
        <GalleryItems />
        <View style={{ width, height, zIndex: -100, position: "absolute" }}>
          <Overlay />
        </View>
      </SafeAreaView> */}
      <EdgeFade position='top' width={width} height={100} />
      <Animated.View
        className='w-full flex items-center justify-center relative '
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight,
          },
          HeaderAnimatedStyle,
        ]}
      >
        <Animated.View
          className='z-50 text-center space-y-4 items-center flex flex-col'
          entering={textEntering}
        >
          <Text className='text-5xl md:text-7xl z-50 text-black/70 dark:text-white font-calendas italic'>
            favorites.
          </Text>
        </Animated.View>
        <Canvas
          style={{
            flex: 1,
            position: "absolute",
            height: headerHeight,
            width: width,
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        >
          {imagesArr.flat().map(({ x, y, width, height, image }, idx) => {
            const shiftConstantX = useDerivedValue(() => {
              const res = interpolate(
                scrollYOffset.get(),
                [0, headerHeight],
                [-10, 10],
                Extrapolation.CLAMP
              );
              return res + x;
            }, [scrollYOffset.get()]);

            const shiftConstantY = useDerivedValue(() => {
              const res = interpolate(
                scrollYOffset.get(),
                [0, headerHeight],
                [-10, 10],
                Extrapolation.CLAMP
              );
              return res + y;
            }, [scrollYOffset.get()]);
            return (
              <SkImage
                key={idx}
                image={image}
                fit='cover'
                x={shiftConstantX}
                y={shiftConstantY}
                width={width}
                height={height}
              />
            );
          })}
        </Canvas>
        <View className='absolute top-16 left-16 w-full z-20 pt-1'>
          <Text className='text-xl text-start px-4 tracking-tighter font-semibold italic dark:text-white/90 text-black/70'>
            Recent
          </Text>
        </View>
        <View className='absolute bottom-2 left-0 w-full z-20 space-y-2'>
          <View className='flex w-full items-center justify-start px-4 gap-4 flex-row mt-1'>
            <Button variant='default' size='sm' className='rounded-xl'>
              <Text className='text-base text-center text-white'>
                All Photos
              </Text>
            </Button>
            <Button variant='outline' size='sm' className='rounded-xl bg-none'>
              <Text className='text-base text-center text-black'>
                Favorites Only
              </Text>
            </Button>
          </View>
        </View>
      </Animated.View>

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
          paddingTop: headerHeight + 4,
          paddingBottom: 50,
        }}
        numColumns={2}
        estimatedItemSize={50}
        recycleItems
        data={Array.from({ length: 10 }, (_, i) => i)}
        renderItem={({ index }) => (
          <LegendListColumnCenter index={index} numColumns={2}>
            <View
              className=' my-[2px] rounded-3xl overflow-hidden'
              style={{ width: width / 2 - 6, height: width / 2 + 100 }}
            >
              <Image
                style={{
                  backgroundColor: "#d1d5db",
                  flex: 1,
                }}
                source={`https://picsum.photos/seed/${index + 10}/3000/2000`}
                contentFit='cover'
                placeholder={blurhash}
                transition={1000}
              />
            </View>
          </LegendListColumnCenter>
        )}
      ></LegendList>

      <BlurView
        className='h-10 w-10 rounded-full absolute top-16 left-5 overflow-hidden flex items-center justify-center z-10'
        intensity={60}
        tint={colorScheme === "light" ? "dark" : "light"}
      >
        <ChevronUp strokeWidth={2} size={30} className='text-white ' />
      </BlurView>

      <BlurView
        className='h-10 w-20 rounded-full absolute top-16 right-5 overflow-hidden flex items-center justify-center z-10'
        intensity={60}
        tint={colorScheme === "light" ? "dark" : "light"}
      >
        <Text className='text-base text-center text-white'>Select</Text>
      </BlurView>

      <BlurView
        className='h-10 w-10 rounded-full absolute top-16 right-28 overflow-hidden flex items-center justify-center z-10'
        intensity={60}
        tint={colorScheme === "light" ? "dark" : "light"}
      >
        <Settings2 strokeWidth={2} size={18} className='text-white ' />
      </BlurView>

      <EdgeFade position='bottom' width={width} height={100} />
    </Animated.View>
  );
}

export default GalleryPage;
