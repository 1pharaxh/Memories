import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, Pressable, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SymbolView, SymbolViewProps, SFSymbol } from "expo-symbols";
import { useColorScheme } from "nativewind";
import { useRouter } from "expo-router";

const videoSource = require("../assets/videos/6010489-uhd_2160_3840_25fps.mp4");
const words = "SEND MEMORIES THAT EXPLODE";

function AnimatedWord({
  word,
  delay,
  className,
}: {
  word: string;
  delay: number;
  className?: string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, delay + 100);
    return () => clearTimeout(timer);
  }, [delay + 100]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().mass(1).damping(20)}
    >
      <Text className={className}>{word}</Text>
    </Animated.View>
  );
}

export default function App() {
  const [animationKey, setAnimationKey] = useState(0);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.staysActiveInBackground = true;
    player.play();
  });
  const router = useRouter();
  return (
    <View className="flex-1">
      <VideoView
        className="absolute top-0 left-0 w-20 h-40"
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
        }}
        nativeControls={false}
        player={player}
        allowsFullscreen={true}
        contentFit="cover"
        allowsPictureInPicture={true}
        startsPictureInPictureAutomatically={true}
      />

      <Animated.View
        className="absolute -top-10 left-0 w-screen h-screen flex justify-center items-start z-20 pl-5"
        key={animationKey}
      >
        {words.split(" ").map((word, i) => (
          <AnimatedWord
            key={i}
            word={word}
            delay={i * 400}
            className="text-secondary text-start text-7xl font-extrabold mb-5 tracking-widest"
          />
        ))}
      </Animated.View>

      <Animated.View
        key={`continue-${animationKey}`}
        entering={FadeInDown.delay(1700).springify().mass(0.5).damping(11)}
        className="absolute bottom-10 px-14 left-0 w-screen h-20 flex justify-center items-center z-20"
      >
        <Pressable
          onPress={() => {
            setAnimationKey((prev) => prev + 1);
            router.replace("/(tabs)");
          }}
          className="bg-secondary w-full h-full flex rounded-full items-center justify-center gap-5 flex-row"
        >
          <Text className="text-primary text-2xl font-bold">CONTINUE</Text>
          <SymbolView
            name="arrow.right"
            animationSpec={{
              effect: {
                type: "bounce",
                direction: "down",
                wholeSymbol: true,
              },
            }}
            weight="bold"
            colors={"#000"}
            tintColor={"#000"}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}
