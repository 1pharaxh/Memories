import {
  Canvas,
  Circle,
  Group,
  Rect,
  RoundedRect,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, View } from "react-native";
import DottedBackground from "./DottedBackground";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {};

const { width, height } = Dimensions.get("window");

const Dot = ({
  index,
  xCoord,
  yCoord,
}: {
  index: number;
  xCoord: SharedValue<number>;
  yCoord: SharedValue<number>;
}) => {
  const currentRow = Math.floor(index / 12) * 30 - 90;
  const currentCol = Math.floor(index % 12) * 30 + 35 - 25;
  const rad = useDerivedValue(() => {
    const hypot = Math.hypot(
      xCoord.get() - currentCol,
      yCoord.get() - 30 - currentRow
    );

    if (hypot < 55 && xCoord.get() !== -1) {
      return withSpring(10);
    } else {
      return withSpring(5);
    }
  });
  return <Circle cx={currentCol} cy={currentRow + 100} r={rad} color='black' />;
};

const GridSelector = (props: Props) => {
  const xCoord = useSharedValue(0);
  const yCoord = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      xCoord.value = x;
      yCoord.value = y - 50;
    })
    .onChange(({ x, y }) => {
      xCoord.value = x;
      yCoord.value = y - 50;
    })
    .onFinalize(() => {
      xCoord.value = -1;
      yCoord.value = -1;
    })
    .onEnd(({ x, y }) => {
      xCoord.value = x;
      yCoord.value = y - 50;
    });
  return (
    <View className='flex-1 flex items-center justify-center'>
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            width: 256,
            height: 256,
            backgroundColor: "red",
            overflow: "hidden",
            borderRadius: 50,
          }}
        >
          {Array.from({ length: 500 }, (_, i) => i).map((i) => (
            <Dot yCoord={yCoord} xCoord={xCoord} index={i} key={i} />
          ))}
        </Canvas>
      </GestureDetector>
    </View>
  );
};
export default GridSelector;
