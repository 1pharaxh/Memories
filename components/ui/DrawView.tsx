import { Skia, SkPath } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  children: React.ReactNode;
  currentPath: SharedValue<SkPath>;
};

const DrawView = ({ children, currentPath }: Props) => {
  const currentPathObject = useSharedValue(Skia.Path.Make());
  const currentPathX = useSharedValue(0);
  const currentPathY = useSharedValue(0);
  const isStartDrawing = useSharedValue(false);

  useDerivedValue(() => {
    const newPath = currentPathObject.value.copy();
    if (isStartDrawing.value) {
      newPath.moveTo(currentPathX.value, currentPathY.value);
      newPath.lineTo(currentPathX.value, currentPathY.value);
    } else if (currentPathX.value !== 0 && currentPathY.value !== 0) {
      newPath.lineTo(currentPathX.value, currentPathY.value);
    }
    currentPathObject.value = newPath;

    currentPath.value = newPath;
  });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .maxPointers(1)
    .onBegin((e) => {
      currentPathX.value = e.x;
      currentPathY.value = e.y;
      isStartDrawing.value = true;
    })
    .onChange((e) => {
      currentPathX.value = e.x;
      currentPathY.value = e.y;
      isStartDrawing.value = false;
    });

  return <GestureDetector gesture={pan}>{children}</GestureDetector>;
};

export default DrawView;
