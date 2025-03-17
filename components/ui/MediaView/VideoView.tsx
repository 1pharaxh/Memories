import React from "react";
import {
  Canvas,
  ColorMatrix,
  Fill,
  fitbox,
  ImageShader,
  rect,
  useVideo,
} from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";

interface VideoViewProps {}
export default function VideoViewComponent({}: VideoViewProps) {
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { video, filter } = useGlobalStore();
  const { currentFrame, rotation, size } = useVideo(video, {
    paused,
  });
  const src = rect(0, 0, size.width, size.height);
  const dst = rect(0, 0, width, height);
  const transform = fitbox("cover", src, dst, rotation);
  console.log("transform", transform);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => (paused.value = !paused.value)}
    >
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <ImageShader
            image={currentFrame}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
          />
          <ColorMatrix
            matrix={
              filter && filter.colorMatrix.length > 0
                ? filter.colorMatrix
                : [
                    1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                    1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                  ]
            }
          />
        </Fill>
      </Canvas>
    </Pressable>
  );
}
