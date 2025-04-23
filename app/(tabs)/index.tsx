import {
  CameraView,
  CameraType,
  CameraMode,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import CameraTools from "~/components/ui/CameraTools";
import RecordingCounter from "~/components/ui/RecordingCounter";
import VideoViewComponent from "~/components/ui/VideoView";
import useGlobalStore from "~/store/globalStore";
import MediaView from "~/components/ui/MediaView/MediaView";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const [permission, requestPermission] = useCameraPermissions();

  const {
    setHandleTakePicture,
    setHandleTakeVideo,
    setPhoto,
    photo,
    setVideo,
    video,
    cameraMode,
    setCameraMode,
    isRecording,
    setIsRecording,
  } = useGlobalStore();

  const handleTakePicture = React.useCallback(async () => {
    const response = await cameraRef.current?.takePictureAsync({
      quality: 1,
    });
    setPhoto(response!.uri);
  }, []);

  const handleTakeVideo = React.useCallback(async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const response = await cameraRef.current?.recordAsync({
        codec: "hvc1",
        maxDuration: 30,
      });
      setVideo(response!.uri);
    }
  }, [isRecording]);

  React.useEffect(() => {
    setHandleTakePicture(handleTakePicture);
    setHandleTakeVideo(handleTakeVideo);
  }, [handleTakePicture, handleTakeVideo]);

  if (photo) return <MediaView type="picture" />;
  if (video) return <MediaView type="video" />;

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      {!!!permission?.granted ? (
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-white font-bold text-4xl">
            Camera permission 😋
          </Text>
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-primary-foreground">on boarding </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              requestPermission();
            }}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-primary-foreground">
              Grant camera permission
            </Text>
          </Pressable>
        </View>
      ) : (
        <CameraView
          key={cameraMode}
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraFacing}
          mode={cameraMode}
          videoStabilizationMode="cinematic"
          focusable
          videoQuality="2160p"
          zoom={cameraZoom}
          enableTorch={cameraTorch}
          flash={cameraFlash}
          onCameraReady={() => console.log("camera is ready")}
        >
          <View className="p-2 mt-28">
            <RecordingCounter />
            <CameraTools
              cameraZoom={cameraZoom}
              cameraFlash={cameraFlash}
              cameraTorch={cameraTorch}
              setCameraZoom={setCameraZoom}
              setCameraFacing={setCameraFacing}
              setCameraTorch={setCameraTorch}
              setCameraFlash={setCameraFlash}
            />
          </View>
        </CameraView>
      )}
    </Animated.View>
  );
}
