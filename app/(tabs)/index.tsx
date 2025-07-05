import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
} from "react-native-vision-camera";
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
import useGlobalStore from "~/store/globalStore";
import MediaView from "~/components/ui/MediaView/MediaView";

export default function HomeScreen() {
  const cameraRef = React.useRef<Camera>(null);
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFlash, setCameraFlash] = React.useState<"on" | "off">("off");
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [cameraZoom, setCameraZoom] = React.useState<number>(0);

  const { hasPermission: permission, requestPermission } =
    useCameraPermission();
  const {
    hasPermission: permissionMicrophone,
    requestPermission: requestPermissionMicrophone,
  } = useMicrophonePermission();

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
    const response = await cameraRef.current?.takePhoto({
      flash: cameraFlash,
    });
    setPhoto(response!.path);
  }, []);

  const handleTakeVideo = React.useCallback(async () => {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      cameraRef.current?.startRecording({
        onRecordingFinished: (video) => setVideo(video.path),
        onRecordingError: (error) => console.error(error),
        flash: cameraFlash,
        videoCodec: "h265",
        fileType: "mp4",
      });
    }
  }, [isRecording]);

  React.useEffect(() => {
    setHandleTakePicture(handleTakePicture);
    setHandleTakeVideo(handleTakeVideo);
  }, [handleTakePicture, handleTakeVideo]);

  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [
    { videoStabilizationMode: "cinematic-extended" },
  ]);

  if (photo) return <MediaView type="picture" />;
  if (video) return <MediaView type="video" />;

  return (
    <Animated.View
      layout={LinearTransition}
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{ flex: 1 }}
    >
      {!!!permission ? (
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
              requestPermissionMicrophone();
            }}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-primary-foreground">
              Grant camera permission
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Camera
            key={cameraMode}
            ref={cameraRef}
            style={{ flex: 1 }}
            audio={cameraMode === "video"}
            device={device!}
            photo={cameraMode === "picture"}
            video={cameraMode === "video"}
            videoStabilizationMode={"cinematic-extended"}
            focusable
            className="absolute"
            format={format}
            fps={60}
            videoBitRate="extra-high"
            zoom={cameraZoom}
            isActive={true}
          ></Camera>
          <View className="p-2 mt-28 absolute top-0 right-0">
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
        </>
      )}
    </Animated.View>
  );
}
