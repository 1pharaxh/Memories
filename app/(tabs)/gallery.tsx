import React from "react";

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, View } from "react-native";
import { Share, Info, Trash2, Heart } from "~/lib/icons/index";
import TouchableBounce from "~/components/ui/TouchableBounce";
import { Image } from "expo-image";
const PADDING_X = 25;
const PADDING_Y = 100;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const { width, height } = Dimensions.get("window");

type Props = {};

function GalleryPage({}: Props) {
  const isExpanded = useSharedValue<boolean>(false);
  const onPress = () => {
    "worklet";
    const value = !isExpanded.value;
    isExpanded.value = value;
  };

  const galleryBlobStyle = useAnimatedStyle(() => {
    const widthX = width - PADDING_X;
    const targetHeight = isExpanded.value ? height - PADDING_Y : widthX;
    const translateY = isExpanded.value ? PADDING_Y : 0;
    return {
      width: widthX,
      height: withTiming(targetHeight),
      transform: [
        {
          translateY: withTiming(translateY),
        },
      ],
    };
  });

  const buttonRowStyle = useAnimatedStyle(() => {
    let i = +!isExpanded.value;
    const opacity = withTiming(i);
    const translateY = isExpanded.value ? -80 : 10;
    return {
      opacity: opacity,
      transform: [
        {
          translateY: withTiming(translateY, {
            duration: 500,
            easing: Easing.elastic(2),
            reduceMotion: ReduceMotion.System,
          }),
        },
      ],
    };
  });

  const headingTextStyle = useAnimatedStyle(() => {
    const widthX = width - PADDING_X;
    const collapsedHeight = widthX - 60;
    const expandedHeight = height - PADDING_Y;

    const targetHeight = isExpanded.value ? expandedHeight : collapsedHeight;

    const translateY = withTiming(isExpanded.value ? 100 : targetHeight / 2, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      transform: [
        {
          translateY: translateY,
        },
      ],
      alignItems: "center",
      justifyContent: "center",
    };
  });
  const subHeadingTextStyle = useAnimatedStyle(() => {
    const widthX = width - PADDING_X;
    const collapsedHeight = widthX + 60;
    const expandedHeight = height - PADDING_Y;

    const targetHeight = isExpanded.value ? expandedHeight : collapsedHeight;

    const translateY = withTiming(isExpanded.value ? 60 : targetHeight / 2, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });

    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      transform: [
        {
          translateY: translateY,
        },
      ],
      alignItems: "center",
      justifyContent: "center",
    };
  });

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center gap-4 px-5">
        <View className="flex-col justify-end items-center gap-6 h-fit w-full ">
          <TouchableBounce onPress={onPress} sensory>
            <Animated.View
              style={galleryBlobStyle}
              className="rounded-3xl overflow-hidden"
            >
              <View className="relative">
                <Animated.Text
                  className="text-6xl font-extrabold tracking-tighter text-center dark:text-white text-black/70 "
                  style={headingTextStyle}
                >
                  Akarshan
                </Animated.Text>

                <Animated.Text
                  style={subHeadingTextStyle}
                  className="text-2xl font-medium tracking-tighter text-center dark:text-white text-black/70 "
                >
                  April
                </Animated.Text>

                {Array(8)
                  .fill(null)
                  .map((_, index) => {
                    const containerWidth = width - 40;
                    const expandedContainerHeight = height - PADDING_Y;
                    const boxWidth = 144;
                    const boxHeight = 192;
                    const positions = [
                      { left: 0, top: -boxHeight / 3 },
                      {
                        left: containerWidth / 2 - boxWidth / 2.5,
                        top: -boxHeight / 3,
                      },
                      { right: 0, top: -boxHeight / 3 },
                      { left: 0, top: boxHeight - boxHeight / 3 },
                      { right: 0, top: boxHeight - boxHeight / 3 },
                      { left: 0, top: boxHeight * 1.65 },
                      {
                        left: containerWidth / 2 - boxWidth / 2.5,
                        top: boxHeight * 1.65,
                      },
                      { right: 0, top: boxHeight * 1.65 },
                    ];

                    const translation = [
                      { x: 50, y: 210, rotate: -0.1 },
                      { x: 100, y: 220, rotate: 0.15 },
                      { x: -120, y: 340, rotate: 0.1 },
                      { x: 60, y: 300, rotate: 0.1 },
                      { x: -20, y: 310, rotate: -0.1 },
                      { x: 20, y: 300, rotate: -0.1 },
                      { x: 30, y: 200, rotate: -0.1 },
                      { x: -20, y: 300, rotate: 0.2 },
                    ];

                    const animatedStyles = useAnimatedStyle(() => {
                      const translateX = isExpanded.value
                        ? translation[index].x
                        : 0;
                      const translateY = isExpanded.value
                        ? translation[index].y
                        : 0;

                      const rotate = isExpanded.value
                        ? translation[index].rotate
                        : 0;
                      return {
                        transform: [
                          { translateX: withTiming(translateX) },
                          { translateY: withTiming(translateY) },
                          { rotate: withTiming(`${rotate}rad`) },
                        ],
                      };
                    });

                    return (
                      <Animated.View
                        key={index}
                        style={[positions[index], animatedStyles]}
                        className="bg-green-500 h-48 w-36 absolute rounded-xl overflow-hidden"
                      >
                        <Image
                          style={{
                            width: 144,
                            height: 192,
                            backgroundColor: "red",
                            flex: 1,
                          }}
                          source={{
                            uri: "https://picsum.photos/seed/696/3000/2000",
                          }}
                          contentFit="cover"
                          placeholder={blurhash}
                          transition={1000}
                        />
                      </Animated.View>
                    );
                  })}
              </View>
            </Animated.View>
          </TouchableBounce>
          <Animated.View
            style={buttonRowStyle}
            className="flex-row  h-fit items-stretch justify-between gap-1 w-3/5"
          >
            <TouchableBounce sensory>
              <View className="h-40">
                <Share
                  size={24}
                  strokeWidth={2}
                  className="dark:text-muted-foreground text-black/70"
                />
              </View>
            </TouchableBounce>

            <TouchableBounce sensory>
              <View className="h-40">
                <Heart
                  size={24}
                  strokeWidth={2}
                  className="dark:text-muted-foreground text-black/70"
                />
              </View>
            </TouchableBounce>

            <TouchableBounce sensory>
              <View className="h-40">
                <Info
                  size={24}
                  strokeWidth={2}
                  className="dark:text-muted-foreground text-black/70"
                />
              </View>
            </TouchableBounce>

            <TouchableBounce sensory>
              <View className="h-40">
                <Trash2
                  size={24}
                  strokeWidth={2}
                  className="dark:text-muted-foreground text-black/70"
                />
              </View>
            </TouchableBounce>
          </Animated.View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

export default GalleryPage;
