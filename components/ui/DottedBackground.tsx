import React from "react";
import { View, StyleSheet } from "react-native";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";

const DottedBackground = ({
  dotSize = 2,
  dotSpacing = 10,
  color = "#d1d5db",
}: {
  dotSize?: number;
  dotSpacing?: number;
  color?: string;
}) => {
  const width = 500;
  const height = 400;
  const numDotsX = Math.ceil(width / (dotSize + dotSpacing));
  const numDotsY = Math.ceil(height / (dotSize + dotSpacing));

  const dots = [];
  for (let i = 0; i < numDotsY; i++) {
    for (let j = 0; j < numDotsX; j++) {
      const x = j * (dotSize + dotSpacing) + dotSize / 2;
      const y = i * (dotSize + dotSpacing) + dotSize / 2;
      dots.push(
        <Circle key={`${i}-${j}`} cx={x} cy={y} r={dotSize / 2} color={color} />
      );
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-transparent z-0">
      <Canvas style={{ width, height }}>
        <Group>{dots}</Group>
      </Canvas>
    </View>
  );
};

export default DottedBackground;
