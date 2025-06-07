import { Dimensions, Text, View } from "react-native";
import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  DashPathEffect,
  DiscretePathEffect,
  Image,
  LinearGradient,
  Path,
  RuntimeShader,
  Skia,
  useImage,
  vec,
} from "@shopify/react-native-skia";
import { Check } from "~/lib/icons/Check";
import { X } from "~/lib/icons/X";

import useGlobalStore from "~/store/globalStore";
import { GestureHandler } from "../GestureHandler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RenderStickers from "../Stickers/RenderStickers";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  withSequence,
  useDerivedValue,
  interpolate,
  withRepeat,
} from "react-native-reanimated";
import DrawView from "../DrawView";
import TouchableBounce from "../TouchableBounce";
import { H4 } from "../typography";
import { useEffect } from "react";

type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter, stickers, draw, setDraw, isDrawing, setIsDrawing } =
    useGlobalStore();
  const image = useImage(photo);
  const { width, height } = Dimensions.get("window");

  const currentPath = useSharedValue(Skia.Path.Make());

  const buttonStyle = useAnimatedStyle(() => {
    return { opacity: withSpring(isDrawing ? 1 : 0) };
  });

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withSequence(withTiming(100), withTiming(90)),
      -1,
      true
    );
  }, []);
  const uniforms = useDerivedValue(
    () => ({
      NUM_STRIPES: 25,
      STRENGTH: 1,
      SOFTNESS: 0.0005,
    }),
    [progress]
  );

  const FractalGlassSource = Skia.RuntimeEffect.Make(`
  uniform shader image;

  uniform float NUM_STRIPES;   // number of bands across the screen
  uniform float STRENGTH;      // max displacement in pixels
  uniform float SOFTNESS;

  float displacement(float x, float num_stripes, float strength) {
    float modulus = 1.0 / num_stripes;
    return mod(x, modulus) * strength;
  }

  float fractal_glass(float x) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
       d += displacement(x + float(i) * SOFTNESS, NUM_STRIPES, STRENGTH);
    }
    d = d / 11.0;
    return x + d;
  }

  half4 main(float2 xy) {
    float2 adjustedXY = xy;
    // scale x inwards (e.g., 0.8 = 125% wider image)
    adjustedXY.x *= 0.95;  

    adjustedXY.x = fractal_glass(adjustedXY.x);

    return image.eval(adjustedXY);
  }


`)!;

  return (
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
          <Check strokeWidth={2} size={30} className='text-muted-foreground ' />
        </TouchableBounce>
      </Animated.View>
      <DrawView currentPath={currentPath}>
        <View style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }} {...rest}>
            <RuntimeShader source={FractalGlassSource} uniforms={uniforms} />
            <Image
              x={0}
              y={0}
              width={width}
              height={height}
              image={image}
              fit='cover'
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

            {stickers?.map((e, idx) => (
              <RenderStickers item={e} matrix={e.matrix} key={idx} />
            ))}
          </Canvas>

          {stickers?.map((e, idx) => (
            <GestureHandler debug key={idx} sticker={e} />
          ))}
        </View>
      </DrawView>
    </View>
  );
}
