import { Dimensions, View } from "react-native";
import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  fitbox,
  Group,
  Image,
  processTransform2d,
  rect,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";
import VariableFontAnimateText from "../Stickers/VariableFont";
import { GestureHandler } from "../GestureHandler";
import Animated, { makeMutable, useSharedValue } from "react-native-reanimated";
import { deflate } from "~/lib/utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter, stickers } = useGlobalStore();
  const image = useImage(photo);
  const { width, height } = Dimensions.get("window");

  return (
    <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
      <Canvas style={{ flex: 1 }} {...rest}>
        <Image
          x={0}
          y={0}
          width={width}
          height={height}
          image={image}
          fit="cover"
        />
        {/* if you want text color to not change then move color matrix inside image  */}
        <ColorMatrix
          matrix={
            filter && filter.colorMatrix.length > 0
              ? filter.colorMatrix
              : [
                  1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
                  1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
                ]
          }
        />

        {/* Render text at center of screen */}
        {stickers?.map((e, idx) => (
          <Group key={idx} matrix={e.matrix}>
            <VariableFontAnimateText
              text={e.text}
              xCord={0}
              yCord={e.fontSize} // Adjust for text baseline
              comeback
              fontSize={e.fontSize}
            />
          </Group>
        ))}
      </Canvas>

      {/* Position gesture handler at the same position as text */}
      {stickers?.map((e, idx) => (
        <GestureHandler
          debug
          key={idx}
          matrix={e.matrix}
          size={{
            height: e.height,
            width: e.width,
          }}
        />
      ))}
    </GestureHandlerRootView>
  );
}
