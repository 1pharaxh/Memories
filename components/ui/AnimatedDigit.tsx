import React, { useLayoutEffect } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Text, StyleSheet } from "react-native";
import Animated, {
  Layout,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  useSharedValue,
} from "react-native-reanimated";

type AnimatedDigitProps = {
  digit: number;
  height: number;
  width: number;
  textStyle: StyleProp<TextStyle>;
  duration?: number;
};

const AnimatedDigit: React.FC<AnimatedDigitProps> = React.memo(
  ({ digit, height, width, textStyle, duration = 1000 }) => {
    const flattenedTextStyle = React.useMemo(() => {
      return StyleSheet.flatten(textStyle);
    }, [textStyle]);

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: withSpring(-height * digit, {
              mass: 0.6,
            }),
          },
        ],
      };
    });

    const opacity = useSharedValue(0);

    // Trigger the opacity animation when the component is mounted or the duration changes
    useLayoutEffect(() => {
      opacity.value = withTiming(1, {
        duration,
      });
    }, [duration, opacity]);

    // Define the animated style for the container opacity
    const rContainerStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    return (
      <Animated.View
        layout={Layout}
        exiting={FadeOut}
        entering={FadeIn.duration(duration)}
        style={[
          {
            height,
            width,
            overflow: "hidden",
          },
          rContainerStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              flexDirection: "column",
            },
            rStyle,
          ]}
        >
          {new Array(10).fill(0).map((_, index) => {
            return (
              <Text
                key={index}
                style={{
                  ...flattenedTextStyle,
                  width,
                  height,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                {index}
              </Text>
            );
          })}
        </Animated.View>
      </Animated.View>
    );
  }
);

export { AnimatedDigit };
