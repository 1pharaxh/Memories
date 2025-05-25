import TouchableBounce from "~/components/ui/TouchableBounce";
import { View, Dimensions } from "react-native";

import React, { useCallback, useEffect, useState } from "react";
import {
  Canvas,
  Group,
  RoundedRect,
  useAnimatedImageValue,
  Image,
  rect,
  processTransform2d,
  fitbox,
} from "@shopify/react-native-skia";
import VariableFontAnimateText from "../../Stickers/VariableFont";
import {
  SINGLE_STICKER_OPTIONS,
  STICKER_TABS,
  STICKER_TABS_INTERFACE,
  STICKER_TEXT_NAME,
  STICKER_TYPE,
} from "~/lib/constants";
import GlitchText from "../../Stickers/Glitch";
import BigSmallText from "../../Stickers/BigSmall";
import { useColorScheme } from "~/lib/useColorScheme";
import useGlobalStore, {
  GLOBALS_SINGLE_STICKER_OPTIONS,
} from "~/store/globalStore";
import { useRouter } from "expo-router";
import { deflate } from "~/lib/utils";
import Animated, {
  clamp,
  FadeIn,
  FadeInLeft,
  FadeOutLeft,
  makeMutable,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useImage } from "expo-image";
import { LegendList } from "@legendapp/list";
import { AnimatedMuted } from "../../typography";
import { TAB_BAR_SPRING } from "../../TabBarIcon";
import TextSetting from "./TextSetting";

const TEXT_PILL_HEIGHT = 72;
const GIF_HEIGHT = 180;
type Props = {};

const { width, height } = Dimensions.get("window");

export const CenteredSkiaContent = ({
  width,
  height,
  children,
  scale = 1,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  scale?: number;
}) => {
  // The Group component can be used to transform all children
  return (
    <Group
      transform={[
        { translateX: (width * scale) / 2 },
        { translateY: (height * scale) / 2 },
        { scale: scale },
      ]}
    >
      {children}
    </Group>
  );
};

const RenderSticker = (
  item: SINGLE_STICKER_OPTIONS,
  textStickerWidth: number
) => {
  switch (item.name) {
    case STICKER_TEXT_NAME.BLOOM: {
      const textWidth = item.fontSize * 0.6 * item.name.length; // Approximate width
      return (
        <VariableFontAnimateText
          text={item.name}
          xCord={-textWidth / 2} // Offset by half text width
          yCord={item.fontSize / 4} // Slight vertical adjustment
          comeback
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.GLITCH: {
      const textWidth = item.fontSize * 0.2 * item.name.length; // Approximate width

      return (
        <GlitchText
          fontName={item.fontName}
          text={item.name}
          xCord={-textWidth / 2} // Offset by half text width
          yCord={item.fontSize / 4} // Slight vertical adjustment
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.LEFTWARD: {
      const textWidth = item.fontSize * 0.45 * item.name.length; // Approximate width

      return (
        <VariableFontAnimateText
          text={item.name}
          xCord={-textWidth / 2} // Offset by half text width
          yCord={item.fontSize / 4} // Slight vertical adjustment
          fontSize={item.fontSize}
        />
      );
    }
    case STICKER_TEXT_NAME.RIGHTWARD: {
      const textWidth = item.fontSize * 0.45 * item.name.length; // Approximate width

      return (
        <VariableFontAnimateText
          text={item.name}
          xCord={-textWidth / 2}
          yCord={item.fontSize / 4}
          fontSize={item.fontSize}
          reverse
        />
      );
    }

    case STICKER_TEXT_NAME.BIG: {
      const textWidth = item.fontSize * 0.45 * item.name.length; // Approximate width

      return (
        <BigSmallText
          type='big'
          text={item.name}
          xCord={-textWidth / 2}
          yCord={item.fontSize / 4}
          fontSize={item.fontSize}
          fontName={item.fontName}
        />
      );
    }

    case STICKER_TEXT_NAME.SMALL: {
      const textWidth = item.fontSize * 0.45 * item.name.length; // Approximate width

      return (
        <BigSmallText
          type='small'
          text={item.name}
          xCord={-textWidth / 2}
          yCord={item.fontSize / 4}
          fontSize={item.fontSize}
          fontName={item.fontName}
        />
      );
    }
    default:
      return null;
  }
};

const StickerSheet = (props: Props) => {
  const textStickerWidth = width / 2 - 24;

  const { colorScheme } = useColorScheme();
  const { addStickers } = useGlobalStore();

  const selectedCategory = useSharedValue<string>(STICKER_TABS[0].name);

  const handleSelectCategory = useCallback((e: string) => {
    selectedCategory.set(e);
  }, []);

  const [data, setData] = useState<STICKER_TABS_INTERFACE>(STICKER_TABS[0]);

  useAnimatedReaction(
    () => selectedCategory.get(),
    (select) => {
      const selectedCategoryFromArray = STICKER_TABS.filter(
        (e) => e.name === select
      )[0];
      runOnJS(setData)(selectedCategoryFromArray);
    }
  );

  const [selected, setSelected] = useState<GLOBALS_SINGLE_STICKER_OPTIONS>();

  const onPress = useCallback(
    (item: SINGLE_STICKER_OPTIONS) => {
      // Text properties
      const text = "Hello World this works";

      const textWidth =
        item.type === STICKER_TYPE.TEXT
          ? item.fontSize * text.length * 0.45 // Approximate text width
          : textStickerWidth;

      const textHeight =
        item.type === STICKER_TYPE.TEXT
          ? item.fontSize * 1.2 // Approximate text height
          : GIF_HEIGHT;
      // construct matrix to render in middle of screen
      const src = rect(0, 0, textWidth, textHeight);
      const dst = deflate(rect(0, 0, width, height), 24);
      const m3 = processTransform2d(fitbox("contain", src, dst));
      const matrix = makeMutable(m3);

      setSelected({
        ...item,
        matrix,
        text,
        width: textWidth,
        height: textHeight,
      });

      if (item.type !== STICKER_TYPE.TEXT) {
        addStickers({
          ...item,
          matrix,
          text,
          width: textWidth,
          height: textHeight,
        });
      }
    },
    [addStickers, width, height]
  );

  const animatedCounter = useSharedValue<number>(0);

  useEffect(() => {
    animatedCounter.set(animatedCounter.get() + 1);
  }, [data]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const _ = animatedCounter.get();
    return {
      opacity: withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, TAB_BAR_SPRING)
      ),
    };
  });

  return (
    <>
      {selected?.type !== STICKER_TYPE.TEXT ? (
        <Animated.View
          exiting={FadeOutLeft.delay(100)}
          entering={FadeInLeft.delay(100)}
        >
          <View className='h-20'>
            <Animated.FlatList
              contentContainerStyle={{
                paddingHorizontal: 16,
              }}
              horizontal
              data={STICKER_TABS}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index }) => {
                const delay = index * 400;
                return (
                  <AnimatedTabItem
                    item={item}
                    delay={delay}
                    onPress={() => {
                      handleSelectCategory(item.name);
                    }}
                    selectedCategory={selectedCategory}
                  />
                );
              }}
            />
          </View>
          <Animated.View style={[{ flex: 1 }, animatedContainerStyle]}>
            <LegendList
              contentContainerStyle={{
                width: width - 20,
                flexGrow: 1,
                paddingBlockEnd: height / 1.5,
              }}
              style={{
                paddingHorizontal: 16,
                flexGrow: 0,
                height: height,
              }}
              data={data.stickers}
              numColumns={2}
              estimatedItemSize={100}
              keyExtractor={(item, index) => `${item.name}+${index}`}
              extraData={selected?.name}
              recycleItems
              renderItem={({ item }) => {
                return (
                  <StickerItem
                    item={item}
                    selected={selected}
                    colorScheme={colorScheme}
                    textStickerWidth={textStickerWidth}
                    onItemPress={onPress}
                  />
                );
              }}
            />
          </Animated.View>
        </Animated.View>
      ) : (
        <TextSetting selected={selected} setSelected={setSelected} />
      )}
    </>
  );
};

export default StickerSheet;

const StickerItem = React.memo(
  ({
    item,
    selected,
    colorScheme,
    textStickerWidth,
    onItemPress,
  }: {
    item: SINGLE_STICKER_OPTIONS;
    selected?: GLOBALS_SINGLE_STICKER_OPTIONS;
    colorScheme: string;
    textStickerWidth: number;
    onItemPress: (item: SINGLE_STICKER_OPTIONS) => void;
  }) => {
    return (
      <Animated.View className='mb-4'>
        <TouchableBounce sensory onPress={() => onItemPress(item)}>
          <Canvas
            style={{
              width: textStickerWidth,
              height:
                item.type === STICKER_TYPE.TEXT ? TEXT_PILL_HEIGHT : GIF_HEIGHT,
              flex: 1,
            }}
          >
            {item.type === STICKER_TYPE.TEXT ? (
              <>
                <RoundedRect
                  color={colorScheme === "light" ? "white" : "black"}
                  x={0}
                  y={0}
                  r={25}
                  height={72}
                  width={textStickerWidth}
                />
                <CenteredSkiaContent
                  width={textStickerWidth}
                  height={TEXT_PILL_HEIGHT}
                >
                  {RenderSticker(item, textStickerWidth)}
                </CenteredSkiaContent>
              </>
            ) : (
              <AnimatedImages
                item={item}
                textStickerWidth={textStickerWidth}
                selected={selected}
              />
            )}
          </Canvas>
        </TouchableBounce>
      </Animated.View>
    );
  },
  (prev, next) => {
    const wasSelected = prev.selected?.name === prev.item.name;
    const isSelected = next.selected?.name === next.item.name;

    // If selection state changed for THIS item, re-render
    if (wasSelected !== isSelected) return false;

    // If color scheme changed, re-render
    if (prev.colorScheme !== next.colorScheme) return false;

    // Otherwise don't
    return true;
  }
);

const AnimatedImages = ({
  item,
  textStickerWidth,
  selected = undefined,
}: {
  item: SINGLE_STICKER_OPTIONS;
  textStickerWidth: number;
  selected: GLOBALS_SINGLE_STICKER_OPTIONS | undefined;
}) => {
  const router = useRouter();

  // This can be an animated GIF or WebP file
  const image = useAnimatedImageValue(item.name);

  const expoImage = useImage(selected?.name || item.name);

  const { replaceSticker } = useGlobalStore();
  React.useEffect(() => {
    if (!selected) return;
    if (item.name !== selected.name && selected.type !== STICKER_TYPE.IMAGE)
      return;
    if (!expoImage) return;

    try {
      // Safe access to image dimensions with null checks
      const imgWidth = expoImage?.width || 0;
      const imgHeight = expoImage?.height || 0;

      if (imgWidth === 0 || imgHeight === 0) return;

      const targetWidth = width * 0.4;
      const targetHeight = height * 0.3;

      const widthScale = targetWidth / imgWidth;
      const heightScale = targetHeight / imgHeight;
      const scale = Math.min(widthScale, heightScale);
      const dynamicScale = clamp(scale, 0.1, 1.0);

      if (selected) {
        replaceSticker({
          ...selected,
          width: imgWidth * dynamicScale,
          height: imgHeight * dynamicScale,
        });
      }
    } catch (error) {
      console.log("Error processing image:", error);
    }
    router.back();
  }, [selected, expoImage, item.name, replaceSticker, width, height]);

  // Add error boundary to prevent crashes
  if (!image) {
    return null;
  }

  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={textStickerWidth}
      height={GIF_HEIGHT}
      fit='contain'
    />
  );
};

const AnimatedTabItem = ({
  item,
  selectedCategory,
  delay,
  onPress,
}: {
  item: STICKER_TABS_INTERFACE;
  selectedCategory: SharedValue<string>;
  delay: number;
  onPress?: () => void;
}) => {
  const expand = useDerivedValue(
    () => selectedCategory.get() === item.name,
    [item, selectedCategory]
  );

  const PillTextStyle = useAnimatedStyle(() => {
    return {
      display: expand.get() && expand.get() ? "flex" : "none",
      opacity: withTiming(expand.get() && expand.get() ? 1 : 0, {
        duration: 300,
      }),
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(expand.get() ? 150 : 50),
    };
  });

  return (
    <TouchableBounce sensory onPress={onPress}>
      <Animated.View
        style={animatedStyle}
        entering={FadeIn.duration(delay)}
        className='rounded-2xl h-14 flex flex-row gap-3 items-center justify-center overflow-hidden px-2 mx-2 bg-muted-foreground/10'
      >
        {item.icon}
        <AnimatedMuted style={PillTextStyle} className='text-base'>
          {item.name}
        </AnimatedMuted>
      </Animated.View>
    </TouchableBounce>
  );
};
