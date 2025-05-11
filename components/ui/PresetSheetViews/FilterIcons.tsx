import TouchableBounce from "~/components/ui/TouchableBounce";
import { View } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import useGlobalStore, { Filter } from "~/store/globalStore";

import React, { useCallback } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Canvas,
  vec,
  RadialGradient,
  Circle,
} from "@shopify/react-native-skia";
import { FILTER_PRESETS } from "~/lib/constants";
import TabBarText from "~/components/ui/TabBarText";
import { cn } from "~/lib/utils";

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;
type Props = {};

const FilterIcons = (props: Props) => {
  const { setFilter } = useGlobalStore();
  const icons = FILTER_PRESETS;
  const [selected, setSelected] = React.useState<string | null>(null);

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
        setFilter({ colorMatrix: [], name: "" });
        return;
      } else {
        setFilter(icon);
        setSelected(icon.name);
      }
    },
    [setFilter, setSelected, selected]
  );

  return (
    <>
      {icons.map((icon) => {
        const animatedStyle = createAnimatedStyle(icon.name);
        return (
          <TouchableBounce
            sensory
            key={icon.name}
            onPress={() => {
              onPress(icon);
            }}
          >
            <View>
              <TabBarText className="mt-0 mb-2" accountForDarkMode>
                {icon.name}
              </TabBarText>
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
                <Canvas style={{ width: 72, height: 72 }}>
                  <Circle r={36} c={vec(36, 36)}>
                    <RadialGradient
                      c={vec(128, 128)}
                      r={128}
                      colors={icon.gradientColors}
                    />
                  </Circle>
                </Canvas>
              </Animated.View>
            </View>

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
              <Canvas style={{ width: 72, height: 72 }}>
                <Circle r={36} c={vec(36, 36)}>
                  <RadialGradient
                    c={vec(128, 128)}
                    r={128}
                    colors={icon.gradientColors}
                  />
                </Circle>
              </Canvas>
            </MaskedView>
          </TouchableBounce>
        );
      })}
    </>
  );
};

export default FilterIcons;
