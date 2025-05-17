import React from "react";
import { Text, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeOut,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";
import { GLOBALS_SINGLE_STICKER_OPTIONS } from "~/store/globalStore";
import { Button } from "../../button";

type Props = {
  setSelected: React.Dispatch<
    React.SetStateAction<GLOBALS_SINGLE_STICKER_OPTIONS | undefined>
  >;
  selected: GLOBALS_SINGLE_STICKER_OPTIONS | undefined;
};

function TextSetting({ setSelected, selected }: Props) {
  return (
    <Animated.View
      className='px-4'
      entering={FadeInRight.delay(100)}
      exiting={FadeOutRight.delay(100)}
    >
      
    </Animated.View>
  );
}

export default TextSetting;
