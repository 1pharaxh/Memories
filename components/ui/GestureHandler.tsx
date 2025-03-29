import {
  Skia,
  type SkMatrix,
  type SkSize,
  vec,
} from "@shopify/react-native-skia";
import { Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { rotateZ, scale, translate } from "~/lib/utils";

export enum MatrixIndex {
  ScaleX = 0,
  SkewX = 1,
  TransX = 2,
  SkewY = 3,
  ScaleY = 4,
  TransY = 5,
  Persp0 = 6,
  Persp1 = 7,
  Persp2 = 8,
}
interface GestureHandlerProps {
  matrix: SharedValue<SkMatrix>;
  size: SkSize;
  debug?: boolean;
}

export const GestureHandler = ({
  matrix,
  size,
  debug,
}: GestureHandlerProps) => {
  const pivot = useSharedValue(Skia.Point(0, 0));
  const offset = useSharedValue(Skia.Matrix());
  const pan = Gesture.Pan().onChange((event) => {
    matrix.value = translate(matrix.value, event.changeX, event.changeY);
  });
  const pinch = Gesture.Pinch()
    .onBegin((event) => {
      offset.value = matrix.value;
      pivot.value = vec(event.focalX, event.focalY);
    })
    .onChange((event) => {
      matrix.value = scale(offset.value, event.scale, pivot.value);
    });

  const rotate = Gesture.Rotation()
    .onBegin((event) => {
      offset.value = matrix.value;
      pivot.value = vec(event.anchorX, event.anchorY);
    })
    .onChange((event) => {
      matrix.value = rotateZ(offset.value, event.rotation, pivot.value);
    });
  const gesture = Gesture.Race(pan, pinch, rotate);

  const style = useAnimatedStyle(() => {
    const m3 = matrix.value.get();

    // Extract translation from matrix
    const tx = m3[MatrixIndex.TransX];
    const ty = m3[MatrixIndex.TransY];

    // Extract rotation and scale
    const rotation = Math.atan2(m3[MatrixIndex.SkewY], m3[MatrixIndex.ScaleX]);
    const scaleX = Math.sqrt(
      m3[MatrixIndex.ScaleX] ** 2 + m3[MatrixIndex.SkewY] ** 2
    );

    // Calculate the original dimensions before scaling
    const originalWidth = size.width;
    const originalHeight = size.height;

    // Calculate the half-dimensions for origin adjustments
    const halfWidth = originalWidth / 2;
    const halfHeight = originalHeight / 2;

    return {
      position: "absolute",
      width: originalWidth,
      height: originalHeight,
      backgroundColor: debug ? "rgba(255, 0, 0, 0.5)" : "transparent",
      transform: [
        // Position first
        { translateX: tx },
        { translateY: ty },

        // Move to rotation origin
        { translateX: -halfWidth },
        { translateY: -halfHeight },

        // Apply scale and rotation
        { scale: scaleX },
        { rotate: `${rotation}rad` },

        // Move back from rotation origin
        { translateX: halfWidth },
        { translateY: halfHeight },
      ],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={style}>
        {debug && <Text> native view</Text>}
      </Animated.View>
    </GestureDetector>
  );
};
