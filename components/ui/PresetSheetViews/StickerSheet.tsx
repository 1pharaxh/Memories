import TouchableBounce from "~/components/ui/TouchableBounce";
import { View, Text, Dimensions } from "react-native";

import React, { useCallback, useState } from "react";
import { cx } from "class-variance-authority";
import {
  Canvas,
  Group,
  Rect,
  RoundedRect,
  useAnimatedImageValue,
  Image,
  rect,
  processTransform2d,
  fitbox,
  SkRect,
} from "@shopify/react-native-skia";
import { FlashList } from "@shopify/flash-list";
import * as AC from "@bacons/apple-colors";
import VariableFontAnimateText from "../Stickers/VariableFont";
import {
  SINGLE_STICKER_OPTIONS,
  STICKER_OPTIONS,
  STICKER_TEXT_NAME,
  STICKER_TYPE,
} from "~/lib/constants";
import GlitchText from "../Stickers/Glitch";
import BigSmallText from "../Stickers/BigSmall";
import { useColorScheme } from "~/lib/useColorScheme";
import useGlobalStore, {
  GLOBALS_SINGLE_STICKER_OPTIONS,
} from "~/store/globalStore";
import { useRouter } from "expo-router";
import { deflate } from "~/lib/utils";
import { clamp, makeMutable } from "react-native-reanimated";
import { useImage } from "expo-image";

const TEXT_PILL_HEIGHT = 72;
const GIF_HEIGHT = 180;
type Props = {};

const { width, height } = Dimensions.get("window");

const CenteredSkiaContent = ({
  width,
  height,
  children,
  padding = 0,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  padding?: number;
}) => {
  // The Group component can be used to transform all children
  return (
    <Group transform={[{ translateX: width / 2 }, { translateY: height / 2 }]}>
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
          type="big"
          text={item.name}
          xCord={-textWidth / 2}
          yCord={item.fontSize / 4}
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.SMALL: {
      const textWidth = item.fontSize * 0.45 * item.name.length; // Approximate width

      return (
        <BigSmallText
          type="small"
          text={item.name}
          xCord={-textWidth / 2}
          yCord={item.fontSize / 4}
          fontSize={item.fontSize}
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

      addStickers({
        ...item,
        matrix,
        text,
        width: textWidth,
        height: textHeight,
      });
    },
    [addStickers, width, height]
  );

  return (
    <View className="flex flex-wrap flex-row justify-between p-4 flex-1">
      <FlashList
        className="flex-1 "
        data={STICKER_OPTIONS}
        numColumns={2}
        estimatedItemSize={100}
        keyExtractor={(item) => item.name}
        extraData={selected?.name}
        ListFooterComponentStyle={{
          padding: 360,
        }}
        renderItem={({ item }) => (
          <StickerItem
            item={item}
            selected={selected}
            colorScheme={colorScheme}
            textStickerWidth={textStickerWidth}
            onItemPress={onPress}
          />
        )}
      />
    </View>
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
      <View className="mb-4">
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
                // Don't pass the entire selected object, just what's needed
                selected={selected}
              />
            )}
          </Canvas>
        </TouchableBounce>
      </View>
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
    if (item.name !== selected.name) return;
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
      const dynamicScale = clamp(scale, 1.0, 0.1);

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
      fit="contain"
    />
  );
};
