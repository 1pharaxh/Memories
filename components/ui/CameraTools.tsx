import { View } from "react-native";
import IconButton from "./IconButton";
import { FlashMode } from "expo-camera";
import useGlobalStore from "~/store/globalStore";

interface CameraToolsProps {
  cameraZoom: number;
  cameraFlash: FlashMode;
  cameraTorch: boolean;
  setCameraZoom: React.Dispatch<React.SetStateAction<number>>;
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
  setCameraFlash: React.Dispatch<React.SetStateAction<FlashMode>>;
}
export default function CameraTools({
  cameraZoom,
  cameraFlash,
  cameraTorch,
  setCameraZoom,
  setCameraFacing,
  setCameraTorch,
  setCameraFlash,
}: CameraToolsProps) {
  const { isRecording, setCameraMode, setIsRecording, cameraMode } =
    useGlobalStore();
  return (
    <View
      style={{
        position: "absolute",
        right: 6,
        zIndex: 1,
        gap: 16,
      }}
    >
      <IconButton
        disabled={isRecording}
        onPress={() => setCameraTorch((prevValue) => !prevValue)}
        iosName={
          cameraTorch ? "flashlight.off.circle" : "flashlight.slash.circle"
        }
      />
      <IconButton
        disabled={isRecording}
        onPress={() =>
          setCameraFacing((prevValue) =>
            prevValue === "back" ? "front" : "back"
          )
        }
        iosName={"arrow.triangle.2.circlepath.camera"}
        width={25}
        height={21}
      />
      <IconButton
        disabled={isRecording}
        onPress={() =>
          setCameraFlash((prevValue) => (prevValue === "off" ? "on" : "off"))
        }
        iosName={cameraFlash === "on" ? "bolt.circle" : "bolt.slash.circle"}
      />

      <IconButton
        disabled={isRecording}
        onPress={() => {
          // increment by .01
          if (cameraZoom < 1) {
            setCameraZoom((prevValue) => prevValue + 0.01);
          }
        }}
        iosName={"plus.magnifyingglass"}
      />
      <IconButton
        disabled={isRecording}
        onPress={() => {
          // decrement by .01
          if (cameraZoom > 0) {
            setCameraZoom((prevValue) => prevValue - 0.01);
          }
        }}
        iosName={"minus.magnifyingglass"}
      />
      <IconButton
        disabled={isRecording}
        tintColor={cameraMode === "video" ? "red" : "white"}
        onPress={() => {
          if (cameraMode === "video") {
            console.log("setting camera mode to picture");
            setIsRecording(false);
            setCameraMode("picture");
          } else {
            console.log("setting camera mode to video");
            setCameraMode("video");
          }
        }}
        iosName={cameraMode === "video" ? "video.circle" : "camera.circle"}
      />
    </View>
  );
}
