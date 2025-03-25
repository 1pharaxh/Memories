import TouchableBounce from "~/components/ui/TouchableBounce";
import { View, Text, Dimensions } from "react-native";

import React, { useCallback } from "react";
import { cx } from "class-variance-authority";
import {
  Canvas,
  Group,
  Rect,
  RoundedRect,
  useAnimatedImageValue,
  Image,
} from "@shopify/react-native-skia";
import { FlashList } from "@shopify/flash-list";
import * as AC from "@bacons/apple-colors";
import VariableFontAnimateText from "../TextEffects/VariableFont";
import {
  SINGLE_STICKER_OPTIONS,
  STICKER_OPTIONS,
  STICKER_TEXT_NAME,
  STICKER_TYPE,
} from "~/lib/constants";
import GlitchText from "../TextEffects/Glitch";
import BigSmallText from "../TextEffects/BigSmall";

const TEXT_PILL_HEIGHT = 72;
const GIF_HEIGHT = 180;
type Props = {};

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
  const [selected, setSelected] = React.useState<string | null>(null);
  const { width } = Dimensions.get("window");
  const textStickerWidth = width / 2 - 24;

  const onPress = useCallback(() => {}, []);

  return (
    <View className="flex flex-wrap flex-row justify-between p-4 flex-1">
      <FlashList
        className="flex-1 "
        data={STICKER_OPTIONS}
        numColumns={2}
        estimatedItemSize={100}
        ListFooterComponentStyle={{
          padding: 360,
        }}
        renderItem={({ item }: { item: SINGLE_STICKER_OPTIONS }) => (
          <View className="mb-4">
            <TouchableBounce
              sensory
              onPress={() => {
                onPress();
              }}
            >
              <Canvas
                style={{
                  width: textStickerWidth,
                  height:
                    item.type === STICKER_TYPE.TEXT
                      ? TEXT_PILL_HEIGHT
                      : GIF_HEIGHT,
                  flex: 1,
                }}
              >
                {item.type === STICKER_TYPE.TEXT ? (
                  <>
                    <RoundedRect
                      color={"white"}
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
                  />
                )}
              </Canvas>
            </TouchableBounce>
          </View>
        )}
      />
    </View>
  );
};

export default StickerSheet;

const AnimatedImages = ({
  item,
  textStickerWidth,
}: {
  item: SINGLE_STICKER_OPTIONS;
  textStickerWidth: number;
}) => {
  // This can be an animated GIF or WebP file
  const image = useAnimatedImageValue(item.name);
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
