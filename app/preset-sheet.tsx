import Stack from "~/components/ui/Stack";
import TouchableBounce from "~/components/ui/TouchableBounce";
import { ScrollView, View } from "react-native";
import { GLView } from "expo-gl";

import MaskedView from "@react-native-masked-view/masked-view";
import useGlobalStore from "~/store/globalStore";
import {
  neonFragSrc,
  nighttimeFragSrc,
  onContextCreate,
  summerFragSrc,
  vintageFragSrc,
  winterFragSrc,
} from "~/components/ui/FilterView";

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;

export default function Page() {
  const { setfragmentShader } = useGlobalStore();
  const icons = [
    summerFragSrc,
    winterFragSrc,
    vintageFragSrc,
    neonFragSrc,
    nighttimeFragSrc,
  ];
  return (
    <>
      <Stack.Screen options={{ title: "Choose a preset" }} />
      <ScrollView horizontal contentContainerStyle={{ padding: 24, gap: 32 }}>
        {icons.map((icon) => (
          <TouchableBounce
            sensory
            key={icon}
            onPress={() => {
              setfragmentShader(icon);
            }}
          >
            <View
              style={{
                borderCurve: "continuous",
                overflow: "hidden",
                borderRadius: "100%",
                boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
              }}
            >
              <GLView
                onContextCreate={(gl) => {
                  onContextCreate(gl, icon);
                }}
                style={{
                  aspectRatio: 1,
                  width: 72,
                  opacity: 1,
                }}
              />
            </View>

            <MaskedView
              style={{
                height: 72,
                transform: [{ translateY: 12 }],
              }}
              maskElement={
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "100%",
                    [backgroundImage]: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`,
                  }}
                />
              }
            >
              <GLView
                onContextCreate={(gl) => {
                  onContextCreate(gl, icon);
                }}
                style={{
                  aspectRatio: 1,
                  transform: [{ scaleY: -1 }],
                  opacity: 1,
                  width: 72,
                }}
              />
            </MaskedView>
          </TouchableBounce>
        ))}
      </ScrollView>
    </>
  );
}
