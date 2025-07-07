import TouchableBounce from "~/components/ui/TouchableBounce";
import { PixelRatio, View } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import useGlobalStore, { Filter } from "~/store/globalStore";

import React, { useCallback, useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Paint,
  RuntimeShader,
  Fill,
  Shader,
  ImageShader,
  useImage,
  SkImage,
  AnimatedProp,
  SkRuntimeEffect,
  Image,
} from "@shopify/react-native-skia";
import { FILTER_PRESETS } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { Text } from "../text";

const pd = PixelRatio.get();
const backgroundImage = `experimental_backgroundImage`;
type Props = {};

const FilterIcons = (props: Props) => {
  const { photo, setFilter } = useGlobalStore();
  const icons = FILTER_PRESETS;
  const [selected, setSelected] = React.useState<string | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const createAnimatedStyle = (icon: string) =>
    useAnimatedStyle(() => ({
      opacity: withSpring(selected === icon ? 1 : 0.85, {
        mass: 0.5,
        damping: 11,
        stiffness: 100,
      }),
      borderWidth: withSpring(selected === icon ? 2 : 0, {
        mass: 0.5,
        damping: 11,
        stiffness: 100,
      }),
    }));

  const onPress = useCallback(
    (icon: Filter) => {
      if (selected === icon.name) {
        // toggle
        setSelected(null);
        setFilter({
          lutImage: null,
          name: "",
          primaryShader: null,
          secondaryShader: null,
        });
        return;
      } else {
        setFilter(icon);
        setSelected(icon.name);
      }
    },
    [setFilter, setSelected, selected]
  );

  const image = useImage(photo);

  return (
    <>
      {icons.map((icon, index) => {
        const animatedStyle = createAnimatedStyle(icon.name);
        const lutsImage = useImage(icon.lutImage);
        return (
          <View
            key={index}
            className="flex flex-col gap-2 items-center justify-center"
          >
            <Text className="m-0 p-0">{icon.name}</Text>
            <TouchableBounce
              sensory
              key={icon.name}
              onPress={() => {
                onPress(icon);
              }}
            >
              <View>
                <Animated.View
                  className={cn(
                    selected === icon.name
                      ? "border border-primary/60"
                      : "border border-secondary/60",
                    "rounded-full"
                  )}
                  style={[
                    {
                      borderCurve: "continuous",
                      overflow: "hidden",
                      boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
                    },
                    animatedStyle,
                  ]}
                >
                  <RenderIcon
                    primaryShader={icon.primaryShader!}
                    image={image}
                    lutsImage={lutsImage}
                    secondaryShader={icon.secondaryShader!}
                  />
                </Animated.View>
              </View>

              <MaskedView
                style={{
                  height: 100,
                  transform: [{ translateY: 10 }],
                }}
                maskElement={
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                      [backgroundImage]: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`,
                    }}
                  />
                }
              >
                <RenderIcon
                  primaryShader={icon.primaryShader!}
                  image={image}
                  lutsImage={lutsImage}
                  secondaryShader={icon.secondaryShader!}
                />
              </MaskedView>
            </TouchableBounce>
          </View>
        );
      })}
    </>
  );
};

export default FilterIcons;

const RenderIcon = ({
  primaryShader,
  secondaryShader,
  lutsImage,
  image,
}: {
  primaryShader: AnimatedProp<SkRuntimeEffect>;
  secondaryShader: AnimatedProp<SkRuntimeEffect>;
  lutsImage: AnimatedProp<SkImage | null>;
  image: AnimatedProp<SkImage | null>;
}) => (
  <Canvas style={{ width: 72, height: 72 }}>
    <Image image={image} x={0} y={0} width={72} height={72} fit="cover" />
    <Group transform={[{ scale: 1 / pd }]}>
      <Group
        layer={
          primaryShader !== null && (
            <Paint>
              <RuntimeShader
                source={primaryShader!}
                uniforms={{
                  NUM_STRIPES: 2,
                  STRENGTH: 50,
                  SOFTNESS: 0.1,
                  resolution: [72, 72],
                  pd: pd,
                  shift: 10,
                  progress: 10,
                }}
              />
            </Paint>
          )
        }
        transform={[{ scale: pd }]}
      >
        {secondaryShader !== null && <Fill />}
        {secondaryShader !== null && (
          <Shader
            source={secondaryShader!}
            uniforms={{
              resolution: [72, 72],
              progress: 10,
              filmGrainMultiplyer: 0.2,
              grainScale: 0.8,
            }}
          >
            <ImageShader
              image={image}
              x={0}
              y={0}
              width={72}
              height={72}
              fit="cover"
            />
            <ImageShader
              fit="none"
              image={lutsImage}
              rect={{ x: 0, y: 0, width: 512, height: 512 }}
            />
          </Shader>
        )}
      </Group>
    </Group>
  </Canvas>
);
