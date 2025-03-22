import React, { memo, useEffect, useState } from "react";
import {
  Easing,
  useSharedValue,
  withTiming,
  withRepeat,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import { matchFont, Text, useFonts } from "@shopify/react-native-skia";

type FontWeightTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  playOnce?: boolean;
};

const FontWeightText = memo((props: FontWeightTextProps) => {
  const { xCord, yCord, text, fontSize = 32 } = props;

  const fontMgr = useFonts({
    OverusedGrotesk: [
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Black.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-BlackItalic.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Bold.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-BoldItalic.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Book.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-BookItalic.ttf"),

      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-ExtraBold.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-ExtraBoldItalic.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Italic.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Light.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-LightItalic.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Medium.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-MediumItalic.ttf"),

      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-Roman.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-SemiBold.ttf"),
      require("../../../assets/fonts/Overused-Grotesk/OverusedGrotesk-SemiBoldItalic.ttf"),
    ],
  });

  const boldIndex = useSharedValue(0);
  // Local state to trigger re-renders.
  const [currentBold, setCurrentBold] = useState(0);

  useEffect(() => {
    boldIndex.value = withRepeat(
      withTiming(text.length - 1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [text]);

  // Update local state from the shared value.
  useDerivedValue(() => {
    runOnJS(setCurrentBold)(Math.round(boldIndex.get()));
  }, [boldIndex]);

  let currentX = xCord;

  return (
    <>
      {text.split("").map((char, index) => {
        const isBold = index === currentBold;

        const fontStyle = {
          fontFamily: "OverusedGrotesk",
          fontWeight: isBold ? "600" : "300",
          fontStyle: isBold ? "italic" : "normal",
          fontSize: fontSize,
        } as const;

        // Get the matching font.
        const font = fontMgr ? matchFont(fontStyle, fontMgr) : null;
        const charWidth = font ? font.getTextWidth(char) : fontSize * 0.5;
        const charXPosition = currentX;
        currentX += charWidth;

        return (
          <Text
            key={index}
            font={font}
            text={char}
            x={charXPosition}
            y={yCord}
            opacity={0.9}
          />
        );
      })}
    </>
  );
});

export default FontWeightText;
