import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  BackHandler,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useVideoPlayer, VideoView } from "expo-video";
const videoSource = require("../assets/videos/6010489-uhd_2160_3840_25fps.mp4");

export default function App() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.staysActiveInBackground = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        nativeControls={false}
        player={player}
        allowsFullscreen={true}
        contentFit="cover"
        allowsPictureInPicture={true}
        startsPictureInPictureAutomatically={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  video: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
