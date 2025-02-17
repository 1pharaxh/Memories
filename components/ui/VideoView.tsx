import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, Button, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";

interface VideoViewProps {}
export default function VideoViewComponent({}: VideoViewProps) {
  const ref = useRef<VideoView>(null);
  const { setCameraMode, setIsRecording, video, setVideo } = useGlobalStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
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
    >
      <View
        style={{
          position: "absolute",
          right: 6,
          zIndex: 1,
          paddingTop: 100,
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
      <VideoView
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        player={player}
        allowsFullscreen
        nativeControls={true}
      />
    </Animated.View>
  );
}
