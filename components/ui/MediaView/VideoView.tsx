import React, { useEffect, useRef, useState } from "react";
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
import { Dimensions, View } from "react-native";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import { Audio } from "expo-av";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawView from "../DrawView";
import RenderStickers from "../Stickers/RenderStickers";
import { GestureHandler } from "../GestureHandler";
import IconButton from "../IconButton";

type VideoViewProps = Omit<CanvasProps, "children"> & {};

export default function VideoViewComponent(props: VideoViewProps) {
  const { ...rest } = props;

  const paused = useSharedValue(false);
  const { width, height } = Dimensions.get("screen");

  const { setCameraMode, setIsRecording, video, setVideo, filter, stickers } =
    useGlobalStore();
  const { currentFrame, rotation, currentTime } = useVideo(video, {
    paused,
  });

  const currentPath = useSharedValue(Skia.Path.Make());
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState<boolean>(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  const flag = useRef<boolean>(false);

  const [replaySound, setReplaySound] = useState<boolean>(false);

  useDerivedValue(() => {
    if (currentTime.value === 0) {
      runOnJS(setReplaySound)(true);
    }
  }, [currentTime]);

  useEffect(() => {
    async function playSound() {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync({ uri: video });
        soundRef.current = sound;
      }

      if (replaySound) {
        await soundRef.current?.setPositionAsync(0);
        setReplaySound(false);
      }

      await soundRef.current.setIsMutedAsync(muted);

      if (!isPlaying) {
        await soundRef.current?.pauseAsync();
        flag.current = false;
      } else {
        if (!flag.current) {
          await soundRef.current?.setPositionAsync(currentTime.value);
          flag.current = true;
        }
        await soundRef.current?.playAsync();
      }
    }

    playSound();
  }, [muted, isPlaying, currentTime.value, replaySound]);

  const src = rect(0, 0, width, height);
  const dst = rect(0, 0, width, height);
  const transform = fitbox("cover", src, dst, rotation);

  const resetAndClose = async () => {
    setVideo("");
    setCameraMode("picture");
    setIsRecording(false);
    soundRef.current?.stopAsync();
  };

  return (
    <View className="flex-1">
      <View
        className="mt-28"
        style={{
          position: "absolute",
          right: 6,
          zIndex: 2,
          gap: 16,
        }}
      >
        <IconButton
          onPress={async () => {
            await resetAndClose();
          }}
          iosName={"xmark"}
        />

        <IconButton
          onPress={async () => {
            setMuted(!muted);
          }}
          iosName={!muted ? "speaker.wave.2" : "speaker.slash"}
        />
        <IconButton
          iosName={isPlaying ? "pause" : "play"}
          onPress={() => {
            if (isPlaying) {
              paused.value = true;
              setIsPlaying(false);
            } else {
              paused.value = false;
              setIsPlaying(true);
            }
          }}
        />
      </View>

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
                transform={transform}
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

              <Path
                path={currentPath}
                color="#61DAFB"
                style="stroke"
                strokeWidth={2}
              >
                <DiscretePathEffect length={10} deviation={2} />
              </Path>

              {stickers?.map((e, idx) => (
                <RenderStickers item={e} matrix={e.matrix} key={idx} />
              ))}
            </Canvas>

            {stickers?.map((e, idx) => (
              <GestureHandler debug key={idx} sticker={e} />
            ))}
          </View>
        </DrawView>
      </GestureHandlerRootView>
    </View>
  );
}
