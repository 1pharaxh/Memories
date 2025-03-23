import React, { memo, useEffect, useState } from "react";
import {
  Easing,
  useSharedValue,
  withTiming,
  withRepeat,
  runOnJS,
  useDerivedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { matchFont, Text, useFonts } from "@shopify/react-native-skia";

type FontWeightTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  reverse?: boolean;
  playOnce?: boolean;
};

const FontWeightText = memo((props: FontWeightTextProps) => {
  const {
    xCord,
    yCord,
    text,
    fontSize = 32,
    reverse = false,
    playOnce = false,
  } = props;

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

  const boldIndex = useSharedValue(reverse ? text.length : 0);
  // Local state to trigger re-renders.
  const [currentBold, setCurrentBold] = useState(0);

  const calculateDuration = interpolate(
    text.length,
    [0, 100], // Input range
    [1700, 2500], // Output range
    Extrapolate.CLAMP
  );

  useEffect(() => {
    const animate = withTiming(reverse ? 0 : text.length, {
      duration: calculateDuration,
      easing: Easing.linear,
    });
    boldIndex.value = playOnce ? animate : withRepeat(animate, -1, false);
  }, [text, playOnce, reverse]);

  // Update local state from the shared value.

  const interpolatedIndex = useDerivedValue(() => {
    return interpolate(boldIndex.value, [-1, text.length], [-1, text.length]);
  });
  // useEffect  but for reanimated values.
  useDerivedValue(() => {
    runOnJS(setCurrentBold)(interpolatedIndex.get());
  }, [interpolatedIndex]);

  let currentX = xCord;

  return (
    <>
      {text.split("").map((char, index) => {
        const fontWeight = interpolate(
          index,
          [
            currentBold - 2,
            currentBold - 1,
            currentBold,
            currentBold + 1,
            currentBold + 2,
          ],
          [300, 500, 700, 500, 300], // Gradual weight changes
          Extrapolate.CLAMP
        );

        const fontStyleInText = interpolate(
          index,
          [
            currentBold - 2,
            currentBold - 1,
            currentBold,
            currentBold + 1,
            currentBold + 2,
          ],
          [0, 0, 1, 0, 0], // Gradual italic changes
          Extrapolate.CLAMP
        );

        const fontStyle = {
          fontFamily: "OverusedGrotesk",
          fontWeight: String(fontWeight) as "300" | "400" | "500" | "700",
          fontStyle: fontStyleInText ? "italic" : "normal",
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
