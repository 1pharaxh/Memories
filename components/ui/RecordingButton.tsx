import { SymbolView } from "expo-symbols";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGlobalStore from "~/store/globalStore";

type Props = {};

const RecordingButton = (props: Props) => {
  const { isRecording, setIsRecording, handleTakePicture, handleTakeVideo } =
    useGlobalStore();
  const [cameraMode, setCameraMode] = React.useState("picture");

  return (
    <TouchableOpacity
      onLongPress={() => (
        setCameraMode("video"), setIsRecording(true), handleTakeVideo(false)
      )}
      onPress={() => (
        setCameraMode("picture"), setIsRecording(false), handleTakePicture()
      )}
      onPressOut={() => (
        setCameraMode("picture"), setIsRecording(false), handleTakeVideo(true)
      )}
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
      >
        <SymbolView
          name={"circle.fill"}
          size={70}
          weight="ultraLight"
          type="hierarchical"
          tintColor={isRecording ? "red" : "white"}
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
