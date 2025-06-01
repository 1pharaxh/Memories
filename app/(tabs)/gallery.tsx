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
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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
const { width, height } = Dimensions.get("screen");

const headerHeight = height / 1.8;
const viewWidth = 72;
const viewHeight = 86;
const centerX = width / 2;
const centerY = headerHeight / 2 + 10;

const numImages = 8; // Number of surrounding images

const positionArray: { x: number; y: number }[] = [];

const radiusX = 140;
const radiusY = 130;

for (let i = 0; i < numImages; i++) {
  const angle = (i / numImages) * 2 * Math.PI;

  const x = centerX + radiusX * Math.cos(angle) - viewWidth / 2;
  const y = centerY + radiusY * Math.sin(angle) - viewHeight / 2;

  positionArray.push({ x, y });
}

type Props = {};
function GalleryPage({}: Props) {
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

  const LegendListRef = useRef<ScrollView>(null);
  const [initialScrollToTop, setInitialScrollToTop] = useState<boolean>(false);

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

  const PhotoMainViewStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollYOffset.value,
      [0, headerHeight],
      [120, 500],
      Extrapolation.CLAMP
    );

    const height = interpolate(
      scrollYOffset.value,
      [0, headerHeight],
      [150, 180],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollYOffset.value,
      [headerHeight / 2, headerHeight],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollYOffset.value,
      [0, headerHeight],
      [0, headerHeight / 2],
      Extrapolation.CLAMP
    );

    return {
      width,
      height,
      opacity,
      transform: [{ translateY }],
    };
  });

  const jitterRange = 0;

  const randomOffsets = useMemo(
    () =>
      Array.from({ length: numImages }, () => ({
        x: clamp((Math.random() - 0.5) * jitterRange, 0, width - viewWidth),
        y: clamp(
          (Math.random() - 0.5) * jitterRange,
          0,
          headerHeight - viewHeight
        ),
      })),
    [numImages]
  );

  const { colorScheme } = useColorScheme();

  const circleImageTransForm = (idx: number) =>
    useAnimatedStyle(() => {
      const baseAngle = (idx / numImages) * 2 * Math.PI;
      const scrollAngle = interpolate(
        scrollYOffset.value,
        [0, headerHeight],
        // PI = 180, 2 Pi = 360
        [0, Math.PI * 2],
        Extrapolation.CLAMP
      );
      const InterPolatedRadX = interpolate(
        scrollYOffset.value,
        [0, headerHeight],
        [radiusX, radiusX * 5],
        Extrapolation.CLAMP
      );
      const InterPolatedRadY = interpolate(
        scrollYOffset.value,
        [0, headerHeight],
        [radiusY, radiusY * 5],
        Extrapolation.CLAMP
      );
      const angle = baseAngle + scrollAngle;
      const opacity = interpolate(
        scrollYOffset.value,
        [headerHeight / 2, headerHeight],
        [1, 0],
        Extrapolation.CLAMP
      );

      const x =
        centerX +
        InterPolatedRadX * Math.cos(angle) -
        viewWidth / 2 +
        randomOffsets[idx].x;
      const y =
        centerY +
        InterPolatedRadY * Math.sin(angle) -
        viewHeight / 2 +
        randomOffsets[idx].y;

      const translateY = interpolate(
        scrollYOffset.value,
        [0, headerHeight],
        [0, headerHeight / 2],
        Extrapolation.CLAMP
      );

      return {
        top: withSpring(y, { duration: idx * 100 }),
        left: withSpring(x, { duration: idx * 100 }),
        opacity,
        transform: [{ translateY }],
      };
    });
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
          style={PhotoMainViewStyle}
          className='rounded-xl overflow-hidden z-10 top-[10]'
        >
          <Image
            style={{
              backgroundColor: "#d1d5db",
              flex: 1,
            }}
            source={`https://picsum.photos/seed/1/3000/2000`}
            contentFit='cover'
            placeholder={blurhash}
            transition={1000}
          />
        </Animated.View>

        {positionArray.map((e, idx) => (
          <Animated.View
            key={idx}
            className='rounded-xl absolute overflow-hidden'
            style={[
              {
                width: viewWidth,
                height: viewHeight,
              },
              circleImageTransForm(idx),
            ]}
          >
            <Image
              style={{
                width: 144,
                height: 192,
                backgroundColor: "#d1d5db",
                flex: 1,
              }}
              source={`https://picsum.photos/seed/${(idx + 2) * 5}/3000/2000`}
              contentFit='cover'
              placeholder={blurhash}
              transition={1000}
            />
          </Animated.View>
        ))}
        <View className='absolute top-16 left-16 w-full z-20 pt-1'>
          <Text className='text-xl text-start px-4 tracking-tighter font-semibold italic dark:text-white/90 text-black/70'>
            Recent favorites
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
