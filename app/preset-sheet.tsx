import Stack from "~/components/ui/Stack";
import TouchableBounce from "~/components/ui/TouchableBounce";
import { ScrollView, View } from "react-native";
import { GLView } from "expo-gl";

import MaskedView from "@react-native-masked-view/masked-view";
import useGlobalStore from "~/store/globalStore";
import {
  neonFragSrc,
  nighttimeFragSrc,
  onContextCreate,
  summerFragSrc,
  vintageFragSrc,
  winterFragSrc,
} from "~/components/ui/FilterView";
import React, { useCallback } from "react";
import { cx } from "class-variance-authority";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;

export default function Page() {
  const { setfragmentShader } = useGlobalStore();
  const icons = [
    summerFragSrc,
    winterFragSrc,
    vintageFragSrc,
    neonFragSrc,
    nighttimeFragSrc,
  ];
  const [selected, setSelected] = React.useState<string | null>(null);

  const createAnimatedStyle = (icon: string) =>
    useAnimatedStyle(() => ({
      opacity: withSpring(selected === icon ? 1 : 0.5, {
        mass: 0.5,
        damping: 11,
        stiffness: 100,
      }),
    }));

  const onPress = useCallback(
    (icon: string) => {
      setfragmentShader(icon);
      setSelected(icon);
    },
    [setfragmentShader, setSelected]
  );

  return (
    <>
      <Stack.Screen options={{ title: "Choose a preset" }} />
      <ScrollView horizontal contentContainerStyle={{ padding: 24, gap: 32 }}>
        {icons.map((icon) => {
          const animatedStyle = createAnimatedStyle(icon);
          return (
            <TouchableBounce
              sensory
              key={icon}
              onPress={() => {
                onPress(icon);
              }}
            >
              <Animated.View
                className={cx(
                  selected === icon
                    ? "border-2 border-secondary"
                    : "border border-gray-200",
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
                <GLView
                  onContextCreate={(gl) => {
                    onContextCreate(gl, icon);
                  }}
                  style={{
                    aspectRatio: 1,
                    width: 72,
                    opacity: 1,
                  }}
                />
              </Animated.View>

              <MaskedView
                style={{
                  height: 72,
                  transform: [{ translateY: 12 }],
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
                <GLView
                  onContextCreate={(gl) => {
                    onContextCreate(gl, icon);
                  }}
                  style={{
                    aspectRatio: 1,
                    transform: [{ scaleY: -1 }],
                    opacity: 1,
                    width: 72,
                  }}
                />
              </MaskedView>
            </TouchableBounce>
          );
        })}
      </ScrollView>
    </>
  );
}
