import React, { memo, useEffect } from "react";
import { Group, Text, useFont } from "@shopify/react-native-skia";
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
import { FontNames, FONTS } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

const DURATION = 500;
// big / small duration for expanding/shrinking
const EX_SH_DURATION = 900;
// Hold expanded/shrunk state for 1 seconds
const HOLD_DURATION = 1700;
// Pause at normal state for 4secnd
const PAUSE_DURATION = 4000;

type BigSmallTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  fontName?: FontNames;
  playOnce?: boolean;
  textColor?: string | undefined;
  type: "big" | "small";
};

const BigSmallText = memo((props: BigSmallTextProps) => {
  const {
    xCord,
    yCord,
    text,
    fontSize = 32,
    fontName = "SF-Pro",
    playOnce = false,
    type,
    textColor = undefined,
  } = props;

  const font = useFont(FONTS[fontName], fontSize);
  const textWidth = font ? font.getSize() : 0;

  const scale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(scale);
    let animation: any;
    const toValue = type === "big" ? 2 : 0.5;

    animation = withSequence(
      withDelay(
        PAUSE_DURATION,
        withTiming(toValue, {
          duration: EX_SH_DURATION,
          easing: Easing.in(Easing.bezierFn(0.25, 0.1, 0.25, 1)),
        })
      ),
      // at peak, start shrinking back to normal size
      withDelay(
        HOLD_DURATION,
        withTiming(1, {
          duration: DURATION,
          easing: Easing.elastic(0.2),
        })
      )
    );

    scale.value = playOnce ? animation : withRepeat(animation, -1, false);
  }, [type, playOnce]);

  const transform = useDerivedValue(() => {
    return [
      { translateX: xCord + textWidth / 2 },
      { translateY: yCord },
      { scale: scale.value },
      { translateX: -(xCord + textWidth / 2) },
      { translateY: -yCord },
    ];
  });

  const { colorScheme } = useColorScheme();

  return (
    <Group transform={transform}>
      <Text
        font={font}
        color={
          textColor ?? colorScheme === "dark"
            ? "rgba(242.25, 242.25, 247.35, 1)"
            : "rgba(43.35, 43.35, 46.35, 1)"
        }
        text={text}
        x={xCord}
        y={yCord}
        opacity={0.9}
      />
    </Group>
  );
});

export default BigSmallText;
