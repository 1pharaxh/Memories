import { Dimensions, View } from "react-native";
import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  DiscretePathEffect,
  Image,
  Path,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";
import { GestureHandler } from "../GestureHandler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RenderStickers from "../Stickers/RenderStickers";
import { useSharedValue } from "react-native-reanimated";
import DrawView from "../DrawView";

type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter, stickers } = useGlobalStore();
  const image = useImage(photo);
  const { width, height } = Dimensions.get("window");

  const currentPath = useSharedValue(Skia.Path.Make());

  return (
    <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
      <DrawView currentPath={currentPath}>
        <View style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }} {...rest}>
            <Image
              x={0}
              y={0}
              width={width}
              height={height}
              image={image}
              fit="cover"
            />
            <ColorMatrix
              matrix={
                filter && filter.colorMatrix.length > 0
                  ? filter.colorMatrix
                  : [
                      1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0,
                      0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                    ]
              }
            />
            {stickers?.map((e, idx) => (
              <RenderStickers item={e} matrix={e.matrix} key={idx} />
            ))}
            <Path
              path={currentPath}
              color="#61DAFB"
              style="stroke"
              strokeWidth={2}
            >
              <DiscretePathEffect length={10} deviation={2} />
            </Path>
          </Canvas>

          {stickers?.map((e, idx) => (
            <GestureHandler debug key={idx} sticker={e} />
          ))}
        </View>
      </DrawView>
    </GestureHandlerRootView>
  );
}
