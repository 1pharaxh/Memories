import React from "react";
import { Dimensions, Text, View } from "react-native";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import GalleryItems from "~/components/ui/GalleryItems";
import { Overlay } from "~/components/ui/gradient/overlay";

type Props = {};
const { width, height } = Dimensions.get("screen");
function GalleryPage({}: Props) {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center gap-4 px-5">
        <Text className="opacity-0"></Text>
        <GalleryItems />
        <View style={{ width, height, zIndex: -100, position: "absolute" }}>
          <Overlay />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

export default GalleryPage;
