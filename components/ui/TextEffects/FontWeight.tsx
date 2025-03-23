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
  Extrapolation,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
import { matchFont, Text, useFonts } from "@shopify/react-native-skia";

type FontWeightTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  reverse?: boolean;
  playOnce?: boolean;
  comeback?: boolean;
};

const FontWeightText = memo((props: FontWeightTextProps) => {
  const {
    xCord,
    yCord,
    text,
    fontSize = 32,
    reverse = false,
    playOnce = false,
    comeback = false,
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

  const dependencies = [text, reverse, comeback, playOnce];

  useEffect(() => {
    // Reset animation
    boldIndex.value = reverse ? text.length : 0;
    setCurrentBold(reverse ? text.length : 0);

    // Create animation
    const animateSpring = withSpring(reverse ? 0 : text.length, {
      mass: 50,
      damping: 34,
      stiffness: 50,
      overshootClamping: true,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.01,
      reduceMotion: ReduceMotion.Never,
    });

    // Apply animation - handle playOnce differently
    if (playOnce) {
      // Just apply the animation directly for playOnce
      boldIndex.value = animateSpring;
    } else {
      // For repeating animation, use withRepeat
      boldIndex.value = withRepeat(animateSpring, -1, comeback);
    }
  }, dependencies);

  useDerivedValue(() => {
    const interpolatedIndex = interpolate(
      boldIndex.value,
      [-1, text.length],
      [-1, text.length]
    );
    runOnJS(setCurrentBold)(interpolatedIndex);
  }, [boldIndex, ...dependencies]);

  // useEffect  but for reanimated values.  Update local state from the shared value.

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
          Extrapolation.CLAMP
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
          Extrapolation.CLAMP
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
