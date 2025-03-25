import React, { memo, useEffect } from "react";
import { Dimensions } from "react-native";
import { Group, Mask, Rect, Text, useFont } from "@shopify/react-native-skia";
import {
  Easing,
  SharedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { FontNames, FONTS } from "~/lib/utils";

const DURATION = 100;

type GlitchTextProps = {
  xCord: number;
  yCord: number;
  text: string;
  fontSize?: number;
  fontName?: FontNames;
  // when true, the glitch effect will only play once
  playOnce?: boolean;
};

const GlitchText = memo((props: GlitchTextProps) => {
  const {
    xCord,
    yCord,
    text,
    fontSize = 32,
    fontName = "SF-Pro",
    playOnce = false,
  } = props;
  const { width, height } = Dimensions.get("window");

  const font = useFont(FONTS[fontName], fontSize);

  const textHeight = font ? font.measureText(text).height : 0;
  const textWidth = font ? font.measureText(text).width : 0;

  const textY = yCord;

  const rectWidth = textWidth;
  const fullRectHeight = textHeight;

  const proportion = 1 / 3;
  const rectHeight = fullRectHeight * proportion;

  const topRectY = height / 2;
  const middleRectY = height / 2 + rectHeight;
  const bottomRectY = height / 2 + rectHeight * 2;

  const renderMask = (
    rectXSv: SharedValue<number>,
    rectY: number,
    maskHeight: number
  ) => (
    <Group>
      <Rect
        color="white"
        height={maskHeight}
        width={rectWidth}
        x={rectXSv}
        y={rectY}
      />
    </Group>
  );

  const renderText = (
    rectXSv: SharedValue<number>,
    rectY: number,
    maskHeight: number = rectHeight
  ) => (
    <Mask mode="luminance" mask={renderMask(rectXSv, rectY, maskHeight)}>
      <Text
        color={"black"}
        font={font}
        text={text}
        x={rectXSv}
        y={textY}
        opacity={0.9}
      />
    </Mask>
  );

  const topHalfX = useSharedValue(xCord);
  const middleHalfX = useSharedValue(xCord);
  const bottomHalfX = useSharedValue(xCord);
  const redTextX = useSharedValue(xCord);
  const greenTextX = useSharedValue(xCord);

  useEffect(() => {
    topHalfX.value = xCord;
    middleHalfX.value = xCord;
    bottomHalfX.value = xCord;
    redTextX.value = xCord;
    greenTextX.value = xCord;
  }, [xCord]);

  const withAnimation = (offsets: number[]) => {
    const animations = offsets.map((offset) =>
      withTiming(xCord + offset, {
        duration: DURATION,
        easing: Easing.bounce,
      })
    );
    animations.push(
      withTiming(xCord, { duration: DURATION, easing: Easing.elastic(3) })
    );
    return withSequence(...animations);
  };

  const triggerAnimation = () => {
    topHalfX.value = withAnimation([-8, -6, -4, 5]);
    middleHalfX.value = withAnimation([-6, -4, 5, -2]);
    bottomHalfX.value = withAnimation([-4, 5, -2, 2]);

    redTextX.value = withAnimation([-2, 5, -4, -6]);
    greenTextX.value = withAnimation([2, -2, 5, -4]);
  };

  useEffect(() => {
    if (playOnce) {
      triggerAnimation();
      return;
    }
    const interval = setInterval(() => {
      triggerAnimation();
    }, DURATION * 4);

    return () => clearInterval(interval);
  }, [xCord, playOnce]);

  return (
    <>
      <Text
        color="#E5484D"
        font={font}
        text={text}
        x={redTextX}
        y={textY}
        opacity={0.6}
      />
      <Text
        color="#12A594"
        font={font}
        text={text}
        x={greenTextX}
        y={textY}
        opacity={0.6}
      />

      {/*Top half*/}
      {renderText(topHalfX, topRectY)}

      {/*Middle half*/}
      {renderText(middleHalfX, middleRectY)}

      {/*Bottom half with fullRectHeight to cater for letters extending below the baseline*/}
      {renderText(bottomHalfX, bottomRectY, fullRectHeight)}
    </>
  );
});

export default GlitchText;
