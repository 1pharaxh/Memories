import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { MotiView, MotiText } from "moti";
import * as Haptics from "expo-haptics";

const videoSource = require("../assets/videos/6010489-uhd_2160_3840_25fps.mp4");
const words = "SEND MEMORIES THAT EXPLODE <>";

function AnimatedWord({
  word,
  delay,
  style,
}: {
  word: string;
  delay: number;
  style: any;
}) {
  useEffect(() => {
    const timerDelay = delay === 0 ? 200 : delay - 200;
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, timerDelay);
    return () => {
      clearInterval(timer);
    };
  }, [delay]);

  return (
    <>
      {word !== "<>" && (
        <MotiText
          style={style}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            duration: 1000,
            type: "spring",
            delay: delay,
          }}
        >
          {word}
        </MotiText>
      )}
    </>
  );
}

export default function App() {
  const [animationKey, setAnimationKey] = useState(0);
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

      <MotiView style={styles.textView} key={animationKey}>
        {words.split(" ").map((word, i) => (
          <AnimatedWord
            key={i}
            word={word}
            // each word’s animation vibrate start 300ms
            delay={i * 400}
            style={styles.text}
          />
        ))}
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          duration: 1000,
          type: "spring",
          delay: 1200,
        }}
        style={styles.btnContainer}
      >
        <Pressable
          onPress={() => {
            // toggle by re mounting by changing key
            setAnimationKey((prev) => prev + 1);
          }}
          style={styles.button}
        >
          <MotiText style={styles.btnText}>CONTINUE</MotiText>
        </Pressable>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  textView: {
    position: "absolute",
    top: -Dimensions.get("window").height / 15,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    zIndex: 10,
  },
  text: {
    // or another color that stands out against your video
    color: "#fff",
    marginBottom: 10,
    fontWeight: "800",
    letterSpacing: 2,
    fontFamily: "Inter-Black",
    fontSize: 60,
  },
  button: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
  },
  btnContainer: {
    position: "absolute",
    bottom: 50,
    zIndex: 11,
    left: 20,
    width: Dimensions.get("window").width - 40,
  },
});
