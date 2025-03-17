import React from "react";
import { AnimatedCount } from "./AnimatedCount";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import useGlobalStore from "~/store/globalStore";
import { Text } from "react-native";

type Props = {};

const RecordingCounter = (props: Props) => {
  const { isRecording } = useGlobalStore();
  // if recording is true start the counter
  const [count, setCount] = React.useState(-1);
  React.useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCount(-1);
    }
  }, [isRecording]);

  return (
    <>
      {count > -1 && (
        <Animated.View
          className="absolute top-0 w-full flex items-center justify-center z-10"
          entering={FadeIn.springify()}
          exiting={FadeOut.springify()}
        >
          <Text>
            <AnimatedCount number={count} />
          </Text>
        </Animated.View>
      )}
    </>
  );
};
export default RecordingCounter;
