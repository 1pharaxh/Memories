import React, { useEffect } from "react";
import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  DiscretePathEffect,
  fitbox,
  Image,
  Path,
  rect,
  Skia,
  useVideo,
} from "@shopify/react-native-skia";
import { Dimensions, Pressable, useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import { Audio } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawView from "../DrawView";
import RenderStickers from "../Stickers/RenderStickers";
import { GestureHandler } from "../GestureHandler";

type VideoViewProps = Omit<CanvasProps, "children"> & {};

export default function VideoViewComponent(props: VideoViewProps) {
  const { ...rest } = props;

  const paused = useSharedValue(false);
  const { width, height } = Dimensions.get("window");

  const { video, filter, stickers } = useGlobalStore();
  const { currentFrame, rotation, size } = useVideo(video, {
    paused,
  });

  const radians = (deg: number) => (deg * Math.PI) / 180;

  const currentPath = useSharedValue(Skia.Path.Make());

  useEffect(() => {
    async function playSound() {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync({ uri: video });

      console.log("Playing Sound");
      await sound.playAsync();
    }

    playSound();
  }, []);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => (paused.value = !paused.value)}
    >
      <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
        <DrawView currentPath={currentPath}>
          <View style={{ flex: 1 }}>
            <Canvas style={{ flex: 1 }} {...rest}>
              <Image
                image={currentFrame}
                x={0}
                y={0}
                width={width}
                height={height}
              />
              <ColorMatrix
                matrix={
                  filter && filter.colorMatrix.length > 0
                    ? filter.colorMatrix
                    : [
                        1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                      ]
                }
              />
              {stickers?.map((e, idx) => (
                <RenderStickers item={e} matrix={e.matrix} key={idx} />
              ))}
              <Path
                path={currentPath}
                color="#61DAFB"
                style="stroke"
                strokeWidth={2}
              >
                <DiscretePathEffect length={10} deviation={2} />
              </Path>
            </Canvas>

            {stickers?.map((e, idx) => (
              <GestureHandler debug key={idx} sticker={e} />
            ))}
          </View>
        </DrawView>
      </GestureHandlerRootView>
    </Pressable>
  );
}
