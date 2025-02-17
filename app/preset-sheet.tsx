import Stack from "~/components/ui/Stack";
import TouchableBounce from "~/components/ui/TouchableBounce";
import { Image, ScrollView, View } from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";
import useGlobalStore from "~/store/globalStore";

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;

export default function Page() {
  const { setFilter } = useGlobalStore();
  const icons = [
    "https://cdn-icons-png.flaticon.com/512/1890/1890298.png",
    "https://github.com/apple.png",
    "https://github.com/facebook.png",
    "https://github.com/1pharaxh.png",
    "https://github.com/gugugaga.png",
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
              switch (icon) {
                case "https://cdn-icons-png.flaticon.com/512/1890/1890298.png":
                  setFilter("summer");
                  break;

                case "https://github.com/apple.png":
                  setFilter("winter");
                  break;

                case "https://github.com/facebook.png":
                  setFilter("vintage");
                  break;

                case "https://github.com/1pharaxh.png":
                  setFilter("neon");
                  break;

                case "https://github.com/gugugaga.png":
                  setFilter("nighttime");
                  break;

                default:
                  setFilter("");
                  break;
              }
            }}
          >
            <View
              style={{
                borderCurve: "continuous",
                overflow: "hidden",
                borderRadius: 20,
                boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image
                source={{ uri: icon }}
                style={{
                  aspectRatio: 1,
                  width: 72,
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
                    [backgroundImage]: `linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 50%)`,
                  }}
                />
              }
            >
              <Image
                source={{ uri: icon }}
                style={{
                  borderRadius: 20,
                  aspectRatio: 1,
                  transform: [{ scaleY: -1 }],
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
