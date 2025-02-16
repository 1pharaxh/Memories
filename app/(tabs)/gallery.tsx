import { Link } from "expo-router";
import React from "react";
import * as Form from "~/components/ui/Form";
import * as AC from "@bacons/apple-colors";

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
        <Form.Text style={{ textAlign: "center", fontSize: 14 }}>
          Gallery Page
        </Form.Text>
        <Form.Text>Show bottom tab {JSON.stringify(showBottomTab)}</Form.Text>

        <Link style={{ color: AC.link }} href="/onboarding">
          back to onboarding
        </Link>
      </SafeAreaView>
    </Animated.View>
  );
}

export default GalleryPage;
