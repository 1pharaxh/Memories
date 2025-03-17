import { ViewProps } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import ImageView from "./ImageView";
import VideoViewComponent from "./VideoView";

type MediaViewProps = ViewProps & {
  type: "picture" | "video";
};

export default function MediaView(props: MediaViewProps) {
  const { type, ...rest } = props;

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
      style={{ flex: 1 }}
      {...rest}
    >
      {type === "picture" ? <ImageView /> : <VideoViewComponent />}
    </Animated.View>
  );
}
