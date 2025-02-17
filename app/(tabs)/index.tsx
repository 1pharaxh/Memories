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
import PictureView from "~/components/ui/PictureView";
import VideoViewComponent from "~/components/ui/VideoView";
import useGlobalStore from "~/store/globalStore";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("video");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);
  const [permission, requestPermission] = useCameraPermissions();

  const handleTakePicture = React.useCallback(async () => {
    setCameraMode("picture");
    const response = await cameraRef.current?.takePictureAsync({});
    setPhoto(response!.uri);
    setCameraMode("video");
  }, []);

  const handleTakeVideo = React.useCallback(
    async (stop: boolean) => {
      if (stop) {
        cameraRef.current?.stopRecording();
        return;
      } else {
        const response = await cameraRef.current?.recordAsync({});
        setVideo(response!.uri);
      }
    },
    [cameraRef]
  );

  const {
    setHandleTakePicture,
    setHandleTakeVideo,
    setPhoto,
    photo,
    setVideo,
    video,
  } = useGlobalStore();

  React.useEffect(() => {
    setHandleTakePicture(handleTakePicture);
    setHandleTakeVideo(handleTakeVideo);
  }, [handleTakePicture, handleTakeVideo]);

  if (photo) return <PictureView picture={photo} setPicture={setPhoto} />;
  if (video) return <VideoViewComponent video={video} setVideo={setVideo} />;

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      {!!!permission?.granted ? (
        <SafeAreaView className="flex-1 justify-center items-center gap-4">
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
        </SafeAreaView>
      ) : (
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={cameraFacing}
          mode={cameraMode}
          zoom={cameraZoom}
          enableTorch={cameraTorch}
          flash={cameraFlash}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onCameraReady={() => console.log("camera is ready")}
        >
          <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
            <View className="p-2">
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
          </SafeAreaView>
        </CameraView>
      )}
    </Animated.View>
  );
}
