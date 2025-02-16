import React, { useMemo } from "react";
import Animated from "react-native-reanimated";

import { AnimatedDigit } from "./AnimatedDigit";

const TEXT_DIGIT_HEIGHT = 55;
const TEXT_DIGIT_WIDTH = 40;
const FONT_SIZE = 50;

type AnimatedCountProps = {
  number: number;
};

const AnimatedCount: React.FC<AnimatedCountProps> = React.memo(({ number }) => {
  const digits = React.useMemo(() => {
    return number
      .toString()
      .split("")
      .map((digit) => parseInt(digit, 10));
  }, [number]);

  const keys = useMemo(() => {
    return digits.reverse().map((_, index) => {
      return "last".repeat(index) + "digit";
    });
  }, [digits]);

  // Render the animated digits
  return (
    <Animated.View
      style={{
        flexDirection: "row-reverse",
      }}
    >
      {digits.map((digit, index) => {
        return (
          <AnimatedDigit
            duration={1250}
            key={keys[index]}
            digit={digit}
            height={TEXT_DIGIT_HEIGHT}
            width={TEXT_DIGIT_WIDTH}
            textStyle={{
              color: "white",
              fontSize: FONT_SIZE,
              fontWeight: "bold",
            }}
          />
        );
      })}
    </Animated.View>
  );
});

export { AnimatedCount };
