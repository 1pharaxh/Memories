import { Link } from "expo-router";
import React from "react";
import { Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useGlobalStore from "~/store/globalStore";

type Props = {};

function GalleryPage({}: Props) {
  const { showBottomTab } = useGlobalStore();

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center items-center gap-4">
        <Text>Gallery Page</Text>
        <Text>Show bottom tab {JSON.stringify(showBottomTab)}</Text>
        <Link
          href="/onboarding"
          className="text-blue-500 border-2 p-2 rounded-full text-lg"
        >
          back to onboarding
        </Link>
      </SafeAreaView>
    </Animated.View>
  );
}

export default GalleryPage;
