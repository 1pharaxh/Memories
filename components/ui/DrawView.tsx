import { Skia, SkPath } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import { debounce } from "lodash";

type Props = {
  children: React.ReactNode;
  currentPath: SharedValue<SkPath>;
};

const DrawView = ({ children, currentPath }: Props) => {
  const { isDrawing, setDraw, draw } = useGlobalStore();
  const currentPathObject = useSharedValue(Skia.Path.Make());
  const currentPathX = useSharedValue(0);
  const currentPathY = useSharedValue(0);
  const isStartDrawing = useSharedValue(false);

  // Reset paths when 'X' is pressed on ImageView
  useEffect(() => {
    if (isDrawing) return;
    else {
      currentPathObject.set(Skia.Path.Make());
      currentPath.set(Skia.Path.Make());
      currentPathY.set(0);
      currentPathX.set(0);
      isStartDrawing.set(false);
    }
  }, [isDrawing]);

  const debouncedSetDraw = React.useMemo(
    () =>
      debounce((newPath: SharedValue<SkPath>) => {
        if (draw) {
          const updated = { ...draw, currentPath: newPath };
          setDraw(updated);
        }
      }, 100),
    [draw, setDraw]
  );

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
      if (isDrawing) {
        currentPathX.value = e.x;
        currentPathY.value = e.y;
        isStartDrawing.value = true;
      }
    })
    .onChange((e) => {
      if (isDrawing) {
        currentPathX.value = e.x;
        currentPathY.value = e.y;
        isStartDrawing.value = false;
      }
    })
    // batch actions on end, cannot use JS thread on every frame!
    .onEnd(() => {
      runOnJS(debouncedSetDraw)(currentPath);
    });

  return <GestureDetector gesture={pan}>{children}</GestureDetector>;
};

export default DrawView;
