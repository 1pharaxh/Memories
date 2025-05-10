import { Skia, SkPath } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";

type Props = {
  children: React.ReactNode;
  currentPath: SharedValue<SkPath>;
};

const DrawView = ({ children, currentPath }: Props) => {
  const { draw, setDraw } = useGlobalStore();
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
      if (draw?.length) {
        currentPathX.value = e.x;
        currentPathY.value = e.y;
        isStartDrawing.value = true;
      }
    })
    .onChange((e) => {
      if (draw?.length) {
        currentPathX.value = e.x;
        currentPathY.value = e.y;
        isStartDrawing.value = false;
      }
    })
    // batch actions on end, cannot use JS thread on every frame!
    // .onEnd(() => {
    //   if (draw?.length) {
    //     const tempDraw = [...draw];
    //     const lastElem = tempDraw.at(-1);
    //     if (lastElem) {
    //       lastElem.currentPath = currentPath;
    //       tempDraw[tempDraw.length - 1] = lastElem;
    //       runOnJS(setDraw)(tempDraw);
    //     }
    //   }
    // });

  return <GestureDetector gesture={pan}>{children}</GestureDetector>;
};

export default DrawView;
