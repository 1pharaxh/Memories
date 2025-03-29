import {
  Group,
  Image,
  SkMatrix,
  useAnimatedImageValue,
} from "@shopify/react-native-skia";
import React from "react";
import { Mutable } from "react-native-reanimated/lib/typescript/commonTypes";
import { STICKER_TEXT_NAME, STICKER_TYPE } from "~/lib/constants";
import { GLOBALS_SINGLE_STICKER_OPTIONS } from "~/store/globalStore";
import VariableFontAnimateText from "./VariableFont";
import GlitchText from "./Glitch";
import BigSmallText from "./BigSmall";

type Props = {
  matrix: Mutable<SkMatrix>;
  item: GLOBALS_SINGLE_STICKER_OPTIONS;
};

function RenderStickers({ matrix, item }: Props) {
  return (
    <Group matrix={matrix}>
      {item.type === STICKER_TYPE.TEXT ? (
        <RenderText item={item} />
      ) : (
        <RenderImage item={item} />
      )}
    </Group>
  );
}

const RenderText = ({ item }: { item: GLOBALS_SINGLE_STICKER_OPTIONS }) => {
  switch (item.name) {
    case STICKER_TEXT_NAME.BLOOM: {
      return (
        <VariableFontAnimateText
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          comeback
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.GLITCH: {
      return (
        <GlitchText
          fontName={item.fontName}
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.LEFTWARD: {
      return (
        <VariableFontAnimateText
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          fontSize={item.fontSize}
        />
      );
    }
    case STICKER_TEXT_NAME.RIGHTWARD: {
      return (
        <VariableFontAnimateText
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          fontSize={item.fontSize}
          reverse
        />
      );
    }

    case STICKER_TEXT_NAME.BIG: {
      return (
        <BigSmallText
          type="big"
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          fontSize={item.fontSize}
        />
      );
    }

    case STICKER_TEXT_NAME.SMALL: {
      return (
        <BigSmallText
          type="small"
          text={item.text}
          xCord={0}
          yCord={item.fontSize}
          fontSize={item.fontSize}
        />
      );
    }
    default:
      return null;
  }
};

export default RenderStickers;

const RenderImage = ({ item }: { item: GLOBALS_SINGLE_STICKER_OPTIONS }) => {
  // This can be an animated GIF or WebP file
  const image = useAnimatedImageValue(item.name);
  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={item.width}
      height={item.height}
      fit="contain"
    />
  );
};
