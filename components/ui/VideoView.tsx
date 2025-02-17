import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, Button, Dimensions, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import FilterView from "./FilterView";

interface VideoViewProps {}
export default function VideoViewComponent({}: VideoViewProps) {
  const ref = useRef<VideoView>(null);
  const { setCameraMode, setIsRecording, video, setVideo } = useGlobalStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState<boolean>(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = muted;
    player.play();
  });

  const resetAndClose = () => {
    setVideo("");
    setCameraMode("picture");
    setIsRecording(false);
  };

  useEffect(() => {
    const subscription = player.addListener("playingChange", (event) => {
      setIsPlaying(event.isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
      className="flex-1"
    >
      <View
        className="mt-28"
        style={{
          position: "absolute",
          right: 6,
          zIndex: 2,
          gap: 16,
        }}
      >
        <IconButton
          onPress={() => {
            resetAndClose();
          }}
          iosName={"xmark"}
        />
        <IconButton
          onPress={async () => await shareAsync(video)}
          iosName={"square.and.arrow.up"}
        />

        <IconButton
          onPress={async () => {
            player.muted = !muted;
            setMuted(!muted);
          }}
          iosName={!muted ? "speaker.wave.2" : "speaker.slash"}
        />
        <IconButton
          iosName={isPlaying ? "pause" : "play"}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
            setIsPlaying(!isPlaying);
          }}
        />
      </View>
      <View className="flex-1">
        <FilterView />

        <VideoView
          className="absolute top-0 left-0 w-20 h-40"
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
          nativeControls={false}
          ref={ref}
          player={player}
          allowsFullscreen={true}
          contentFit="cover"
          allowsPictureInPicture={true}
          startsPictureInPictureAutomatically={true}
        />
      </View>
    </Animated.View>
  );
}
