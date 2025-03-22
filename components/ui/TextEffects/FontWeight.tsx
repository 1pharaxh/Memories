import React, { memo, useEffect } from "react";
import { matchFont, Text, useFont, useFonts } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

type FontWeightTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  playOnce?: boolean;
};

const FontWeightText = memo((props: FontWeightTextProps) => {
  const { xCord, yCord, text, fontSize = 32, playOnce = false } = props;

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
  let currentX = xCord;

  return (
    <>
      {text.split("").map((char, index) => {
        const fontStyle = {
          fontFamily: "OverusedGrotesk",
          fontWeight: index === 4 ? "700" : "100",
          fontStyle: index === 4 ? "italic" : "normal",
          fontSize: fontSize,
        } as const;

        const font = fontMgr ? matchFont(fontStyle, fontMgr) : null;
        const charWidth = font ? font.getTextWidth(char) : fontSize * 0.5;
        const charXPosition = currentX;
        // append the width of each character to the currentX
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
