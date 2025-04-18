import { Blur, Canvas, Circle } from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import { Dimensions, StyleSheet, useColorScheme } from "react-native";
import {
  Easing,
  interpolate,
  useAnimatedProps,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import Animated, {
  interpolateColor,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import {
  useImmersiveOverlay,
  useImmersiveOverlayStore,
} from "~/store/OverlayStore";
import { generateColors } from "~/lib/utils";
import { ENTERING_TIME, EXITING_TIME } from "./constants";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const dimensions = Dimensions.get("window");

/**Blur View Container
 * From my knowledege, skia can't actually blur stuff behind it's canvas, so we'll use BlurView from expo-blur
 */
const Container = ({ children }: { children: React.ReactNode }) => {
  const { displayImmersiveOverlay } = useImmersiveOverlay();

  const animatedBlurViewProps = useAnimatedProps(() => {
    const duration = displayImmersiveOverlay.value
      ? ENTERING_TIME
      : EXITING_TIME;

    return {
      intensity: withTiming(displayImmersiveOverlay.value ? 25 : 0, {
        duration,
      }),
    };
  });

  return (
    <AnimatedBlurView
      style={[
        {
          flex: 1,
        },
        StyleSheet.absoluteFillObject,
      ]}
      intensity={0}
      tint={"light"}
      pointerEvents="none"
      animatedProps={animatedBlurViewProps}
    >
      {children}
    </AnimatedBlurView>
  );
};

/**This is our expansion circle, starts from the bottom and expands to the top  */
const ExpandingCirlce = ({
  colors,
}: {
  colors: ReturnType<typeof generateColors>;
}) => {
  const { displayImmersiveOverlay } = useImmersiveOverlay();

  const expandingCircleProgress = useDerivedValue(() => {
    // A faster exit animation for the expanding circle
    const duration = displayImmersiveOverlay.value
      ? ENTERING_TIME
      : EXITING_TIME;
    return withTiming(displayImmersiveOverlay.value ? 1 : 0, {
      duration,
    });
  });

  const opacity = useDerivedValue(() => {
    return withTiming(displayImmersiveOverlay.value ? 1 : 0.5, {
      duration: EXITING_TIME,
    });
  });

  const isDark = useColorScheme() === "dark";
  const expandingCircleColor = useDerivedValue(() => {
    const colorArray = isDark ? colors.expanding.dark : colors.expanding.light;

    // For multiple colors, create dynamic input ranges
    const inputRange = colorArray.map(
      (_, index) => index / (colorArray.length - 1)
    );

    return interpolateColor(
      expandingCircleProgress.value,
      inputRange,
      colorArray
    );
  });

  const expandingCircleTransform = useDerivedValue(() => {
    return [
      {
        scale: interpolate(expandingCircleProgress.value, [0, 1], [0, 10]),
      },
    ];
  });

  const cr = dimensions.width / 3;

  return (
    <Circle
      cx={dimensions.width / 2}
      cy={dimensions.height + cr}
      r={cr}
      color={expandingCircleColor}
      origin={{
        x: dimensions.width / 2,
        y: dimensions.height + cr,
      }}
      opacity={opacity}
      transform={expandingCircleTransform}
    >
      <Blur blur={15} />
    </Circle>
  );
};

/**Circles (top left and bottom right) that are used to create the background gradient */
const BackgroundCircles = ({
  colors,
}: {
  colors: ReturnType<typeof generateColors>;
}) => {
  const { displayImmersiveOverlay } = useImmersiveOverlay();

  const overlayVisibilityProgress = useDerivedValue(() => {
    return withTiming(displayImmersiveOverlay.value ? 1 : 0, {
      duration: displayImmersiveOverlay.value ? ENTERING_TIME : EXITING_TIME,
    });
  });

  const INITIAL_ANIMATION_DURATION = 1000;
  const REPEATED_ANIMATION_DURATION = 7500;
  const MIN_SCALE_FACTOR = 0.7;
  const MAX_SCALE_FACTOR = 1;

  const breathingProgress = useDerivedValue(() => {
    if (displayImmersiveOverlay.value) {
      // Initial animation from 0 to 1 (only once)
      return withSequence(
        // First animate from 0 to 1 once
        withTiming(1, {
          duration: INITIAL_ANIMATION_DURATION,
          easing: Easing.bezierFn(0, 0.55, 0.45, 1),
        }),
        // Then repeatedly animate between 0.7 and 1
        withRepeat(
          withSequence(
            // Down to 0.7
            withTiming(MIN_SCALE_FACTOR, {
              duration: REPEATED_ANIMATION_DURATION,
            }),
            // Back up to 1
            withTiming(MAX_SCALE_FACTOR, {
              duration: REPEATED_ANIMATION_DURATION,
            })
          ),
          -1, // Infinite repetitions until closed
          true // Don't reverse the animation
        )
      );
    }
    // When closing, animate back to 0
    return withTiming(0, { duration: 500 });
  });

  const CR = dimensions.width;
  /**C1 */
  const c1Opacity = useDerivedValue(() => {
    return interpolate(overlayVisibilityProgress.value, [0, 1], [0, 1]);
  });
  const c1Transform = useDerivedValue(() => {
    return [
      {
        scale: breathingProgress.value,
      },
    ];
  });

  /**C2 */
  const c2Opacity = useDerivedValue(() => {
    return interpolate(overlayVisibilityProgress.value, [0, 1], [0, 1]);
  });
  const c2Transform = useDerivedValue(() => {
    return [
      {
        scale: breathingProgress.value,
      },
    ];
  });

  return (
    <>
      <Circle
        cx={-(CR / 3)}
        cy={0}
        r={CR}
        color={colors.primary}
        transform={c1Transform}
        origin={{
          x: dimensions.width / 2,
          y: dimensions.height,
        }}
        opacity={c1Opacity}
      >
        <Blur blur={300} />
      </Circle>

      <Circle
        cx={CR + CR / 3}
        cy={dimensions.height}
        r={CR}
        color={colors.secondary}
        transform={c2Transform}
        origin={{
          x: dimensions.width / 2,
          y: dimensions.height,
        }}
        opacity={c2Opacity}
      >
        <Blur blur={250} />
      </Circle>
    </>
  );
};

export const Gradient = () => {
  const { colors } = useImmersiveOverlayStore();

  const generatedColors = generateColors(colors);
  return (
    <Container>
      <Canvas style={[{ flex: 1 }, StyleSheet.absoluteFillObject]}>
        <ExpandingCirlce colors={generatedColors} />
        <BackgroundCircles colors={generatedColors} />
      </Canvas>
    </Container>
  );
};
