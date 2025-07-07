import { Dimensions, PixelRatio, Text, View } from "react-native";
import {
  Canvas,
  CanvasProps,
  Fill,
  Group,
  ImageShader,
  Paint,
  RuntimeShader,
  Shader,
  Skia,
  useImage,
  Image,
  Path,
  DiscretePathEffect,
  DashPathEffect,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";
import { Check } from "~/lib/icons/Check";
import { X } from "~/lib/icons/X";
const pd = PixelRatio.get();

import useGlobalStore from "~/store/globalStore";
import { GestureHandler } from "../GestureHandler";
import RenderStickers from "../Stickers/RenderStickers";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withSequence,
  useDerivedValue,
  withRepeat,
} from "react-native-reanimated";
import DrawView from "../DrawView";
import TouchableBounce from "../TouchableBounce";
import { H4 } from "../typography";
import { useEffect, useMemo } from "react";
import { GreyScaleRgbShift, lutWithFilmGrain } from "~/lib/shaders";

type ImageViewProps = Omit<CanvasProps, "children"> & {};
const { width, height } = Dimensions.get("window");

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter, stickers, draw, setDraw, isDrawing, setIsDrawing } =
    useGlobalStore();
  const image = useImage(photo);
  const lutImageSource = useMemo(
    () => filter?.lutImage || null,
    [filter?.lutImage]
  );
  const lutsImage = useImage(lutImageSource);

  const currentPath = useSharedValue(Skia.Path.Make());

  const buttonStyle = useAnimatedStyle(() => {
    return { opacity: withSpring(isDrawing ? 1 : 0) };
  });

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withSequence(withTiming(0), withTiming(100)),
      -1,
      true
    );
  }, []);
  const PrimaryUniforms = useDerivedValue(
    () => ({
      NUM_STRIPES: 5,
      STRENGTH: 50,
      SOFTNESS: 0.005,
      resolution: [width, height],
      pd: pd,
      shift: 10,
      progress: progress.value,
    }),
    [progress]
  );

  const SecondaryUniforms = useDerivedValue(
    () => ({
      resolution: [width, height],
      progress: progress.value,
      filmGrainMultiplyer: 0.2,
      grainScale: 0.8,
    }),
    [progress]
  );

  // Memoize shader components to prevent recreation
  const primaryShaderComponent = useMemo(() => {
    if (!filter?.primaryShader) return null;

    return (
      <Paint>
        <RuntimeShader
          source={filter.primaryShader}
          uniforms={PrimaryUniforms}
        />
      </Paint>
    );
  }, [filter?.primaryShader]);

  const secondaryShaderComponent = useMemo(() => {
    if (!filter?.secondaryShader) return null;

    return (
      <Shader source={filter.secondaryShader} uniforms={SecondaryUniforms}>
        <ImageShader
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
        <ImageShader
          fit="none"
          image={lutsImage}
          rect={{ x: 0, y: 0, width: 512, height: 512 }}
        />
      </Shader>
    );
  }, [filter?.secondaryShader, image, lutsImage]);

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Animated.View
        style={buttonStyle}
        className="absolute top-14 left-10 z-10"
      >
        <TouchableBounce
          sensory
          onPress={() => {
            setIsDrawing(false);
            setDraw(undefined);
          }}
        >
          <X strokeWidth={2} size={30} className="text-muted-foreground " />
        </TouchableBounce>
      </Animated.View>

      <Animated.View
        style={buttonStyle}
        className="absolute top-16 z-10 left-1/2 -translate-x-1/2"
      >
        <H4 className="text-muted-foreground">Finish drawing</H4>
      </Animated.View>

      <Animated.View
        style={buttonStyle}
        className="absolute top-14 right-10 z-10"
      >
        <TouchableBounce
          sensory
          onPress={() => {
            setIsDrawing(false);
          }}
        >
          <Check strokeWidth={2} size={30} className="text-muted-foreground " />
        </TouchableBounce>
      </Animated.View>
      <DrawView currentPath={currentPath}>
        <View style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }} {...rest}>
            <Image
              image={image}
              x={0}
              y={0}
              width={width}
              height={height}
              fit="cover"
            />
            <Group transform={[{ scale: 1 / pd }]}>
              <Group layer={primaryShaderComponent} transform={[{ scale: pd }]}>
                {filter?.secondaryShader && <Fill />}
                {secondaryShaderComponent}
              </Group>
            </Group>

            {stickers?.map((e, idx) => (
              <RenderStickers item={e} matrix={e.matrix} key={idx} />
            ))}

            <Path
              path={currentPath}
              style="stroke"
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
      </DrawView>
    </View>
  );
}
