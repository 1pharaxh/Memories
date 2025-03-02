import { Image } from "expo-image";
import { View } from "react-native";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import FilterView from "./FilterView";

interface PictureViewProps {
  picture: string;
}
export default function PictureView({ picture }: PictureViewProps) {
  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      <View
        className="mt-28"
        style={{
          position: "absolute",
          right: 6,
          zIndex: 2,
          gap: 16,
        }}
      ></View>

      <Image
        source={picture}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 5,
        }}
      />

      <FilterView />
    </Animated.View>
  );
}
