import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  DashPathEffect,
  DiscretePathEffect,
  Fill,
  fitbox,
  Group,
  Image,
  ImageShader,
  LinearGradient,
  Paint,
  Path,
  rect,
  RuntimeShader,
  Shader,
  Skia,
  useImage,
  useVideo,
  vec,
} from "@shopify/react-native-skia";
const pd = PixelRatio.get();
import { Check } from "~/lib/icons/Check";
import { X } from "~/lib/icons/X";

import { Dimensions, PixelRatio, View } from "react-native";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import { Audio } from "expo-av";
import DrawView from "../DrawView";
import RenderStickers from "../Stickers/RenderStickers";
import { GestureHandler } from "../GestureHandler";
import IconButton from "../IconButton";
import TouchableBounce from "../TouchableBounce";
import { H4 } from "../typography";

type VideoViewProps = Omit<CanvasProps, "children"> & {};

export default function VideoViewComponent(props: VideoViewProps) {
  const { ...rest } = props;

  const paused = useSharedValue(false);
  const { width, height } = Dimensions.get("screen");

  const {
    setCameraMode,
    setIsRecording,
    video,
    setVideo,
    filter,
    stickers,
    draw,
    setDraw,
    isDrawing,
    setIsDrawing,
  } = useGlobalStore();
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

  console.log("video is", video);

  const src = rect(0, 0, width, height);
  const dst = rect(0, 0, width, height);
  const fitBoxType = filter?.lutImage ? "none" : "cover"
  const transform = fitbox(fitBoxType, src, dst, rotation);

  const resetAndClose = async () => {
    setVideo("");
    setCameraMode("picture");
    setIsRecording(false);
    soundRef.current?.stopAsync();
  };


  const uniform = {
    NUM_STRIPES: 5,
    STRENGTH: 50,
    SOFTNESS: 0.005,
    resolution: [width, height],
    pd: pd,
    shift: 10,
    progress: 10,
    filmGrainMultiplyer: 0.2,
    grainScale: 0.8,
  };

  // Memoize shader components to prevent recreation
  const primaryShaderComponent = useMemo(() => {
    if (!filter?.primaryShader) return null;

    return (
      <Paint>
        <RuntimeShader source={filter.primaryShader} uniforms={uniform} />
      </Paint>
    );
  }, [filter?.primaryShader]);

  const lutImageSource = useMemo(
    () => filter?.lutImage || null,
    [filter?.lutImage]
  );
  const lutsImage = useImage(lutImageSource);

  const secondaryShaderComponent = useMemo(() => {
    if (!filter?.secondaryShader) return null;

    return (
      <Shader
        source={filter.secondaryShader}
        transform={transform}
        uniforms={uniform}
      >
        <ImageShader
          image={currentFrame}
          x={0}
          y={0}
          width={width}
          height={height}
        />
        <ImageShader
          fit='none'
          image={lutsImage}
          rect={{ x: 0, y: 0, width: 512, height: 512 }}
        />
      </Shader>
    );
  }, [filter?.secondaryShader, lutsImage]);

  const buttonStyle = useAnimatedStyle(() => {
    return { opacity: withSpring(isDrawing ? 1 : 0) };
  });

  return (
    <View className='flex-1'>
      <View
        className='mt-28'
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

      <View style={{ flex: 1, position: "relative" }}>
        <Animated.View
          style={buttonStyle}
          className='absolute top-14 left-10 z-10'
        >
          <TouchableBounce
            sensory
            onPress={() => {
              setIsDrawing(false);
              setDraw(undefined);
            }}
          >
            <X strokeWidth={2} size={30} className='text-muted-foreground ' />
          </TouchableBounce>
        </Animated.View>

        <Animated.View
          style={buttonStyle}
          className='absolute top-16 z-10 left-1/2 -translate-x-1/2'
        >
          <H4 className='text-muted-foreground'>Finish drawing</H4>
        </Animated.View>

        <Animated.View
          style={buttonStyle}
          className='absolute top-14 right-10 z-10'
        >
          <TouchableBounce
            sensory
            onPress={() => {
              setIsDrawing(false);
            }}
          >
            <Check
              strokeWidth={2}
              size={30}
              className='text-muted-foreground '
            />
          </TouchableBounce>
        </Animated.View>

        <>
          <View style={{ flex: 1 }}>
            <Canvas style={{ flex: 1 }} {...rest}>
              <Image
                image={currentFrame}
                x={0}
                y={0}
                width={width}
                transform={transform}
                height={height}
              />
              <Group transform={[{ scale: 1 / pd }]}>
                <Group
                  layer={primaryShaderComponent}
                  transform={[{ scale: pd }]}
                >
                  {filter?.secondaryShader && <Fill />}
                  {secondaryShaderComponent}
                </Group>
              </Group>

              {stickers?.map((e, idx) => (
                <RenderStickers item={e} matrix={e.matrix} key={idx} />
              ))}

              <Path
                path={currentPath}
                style='stroke'
                strokeWidth={draw?.strokeWidth}
              >
                {draw?.selectedEffects.includes("discrete") ? (
                  <DiscretePathEffect
                    length={10}
                    deviation={draw?.discretePathDeviation || 10}
                  />
                ) : null}

                {draw?.selectedEffects.includes("dash") ? (
                  <DashPathEffect
                    intervals={[
                      draw?.dashPathEffectIntervals || 10,
                      draw?.dashPathEffectIntervals || 10,
                    ]}
                  />
                ) : null}

                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(width, height)}
                  colors={draw?.selectedColors || ["black"]}
                />
              </Path>
            </Canvas>

            {stickers?.map((e, idx) => (
              <GestureHandler debug key={idx} sticker={e} />
            ))}
          </View>
        </>
      </View>
    </View>
  );
}
