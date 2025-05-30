import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React from "react";
import { ViewProps } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

type Props = ViewProps & {
  height?: number;
};

const EdgeFade = (props: Props) => {
  const { height, ...rest } = props;
  const { colorScheme } = useColorScheme();
  return (
    <LinearGradient
      colors={
        colorScheme === "dark"
          ? ["transparent", "rgba(0,0,0,0.5)", "black"]
          : ["transparent", "rgba(200,200,200,0.3)", "#f9f9f9"]
      }
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height ?? 100,
          zIndex: 10,
        },
        rest.style,
      ]}
      pointerEvents='none'
    />
  );
};

export default EdgeFade;
