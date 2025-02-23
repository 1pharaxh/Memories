import { SymbolView } from "expo-symbols";
import { View } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGlobalStore from "~/store/globalStore";

type Props = {};

const RecordingButton = (props: Props) => {
  const { isRecording, handleTakePicture, handleTakeVideo, cameraMode } =
    useGlobalStore();

  return (
    <TouchableOpacity
      onLongPress={() => {
        if (cameraMode === "picture") {
          handleTakePicture();
        } else {
          handleTakeVideo();
        }
      }}
      onPress={() => {
        if (cameraMode === "picture") {
          handleTakePicture();
        } else {
          handleTakeVideo();
        }
      }}
    >
      <SymbolView
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        name={"circle"}
        size={90}
        weight="thin"
        type="hierarchical"
        tintColor={"white"}
        fallback={<View></View>}
      >
        <SymbolView
          name={"circle.fill"}
          size={70}
          weight="ultraLight"
          type="hierarchical"
          tintColor={cameraMode === "video" ? "red" : "white"}
          animationSpec={{
            effect: {
              type: isRecording ? "pulse" : "bounce",
            },
            repeating: isRecording,
          }}
        />
      </SymbolView>
    </TouchableOpacity>
  );
};

export default RecordingButton;
