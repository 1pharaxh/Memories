import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const WarpEffect = ({
  children,
  displayImmersiveOverlay,
}: {
  children: React.ReactNode;
  displayImmersiveOverlay: SharedValue<boolean>;
}) => {
  // This give us our 'warp' effect.
  const intensity = 0.1;
  const progress = useDerivedValue(() => {
    if (displayImmersiveOverlay.value) {
      return withSequence(
        withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        }),
        withTiming(0, {
          duration: 1500,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        })
      );
    }
    return withTiming(0, { duration: 300 });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: `${progress.value * -5}deg` },
        { skewY: `${-progress.value * 1.5}deg` },
        { scaleY: 1 + progress.value * intensity },
        { scaleX: 1 - progress.value * intensity * 0.6 },
      ],
    };
  });

  return (
    <Animated.View style={[animatedStyle]} entering={FadeIn} exiting={FadeOut}>
      {children}
    </Animated.View>
  );
};
