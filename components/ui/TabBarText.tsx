import { cx } from "class-variance-authority";
import React, { useEffect, useRef } from "react";
import { Animated, TextProps } from "react-native";

interface TabBarTextProps extends TextProps {
  opacity?: number;
}

export default function TabBarText({
  children,
  opacity = 1,
  style,
  ...rest
}: TabBarTextProps) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the value from 0 to 1 on mount
    Animated.spring(value, {
      toValue: 1,
      useNativeDriver: true,
      speed: 1,
    }).start();
  }, [value]);

  // Interpolate: when value = 0, translateY = 5
  const translateY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 0],
  });

  return (
    <Animated.Text
      {...rest}
      className={cx("text-white text-xs mt-2 text-center", rest.className)}
      style={[style, { opacity, transform: [{ translateY }] }]}
    >
      {children}
    </Animated.Text>
  );
}
