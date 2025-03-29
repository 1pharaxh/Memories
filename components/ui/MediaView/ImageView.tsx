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
import VariableFontAnimateText from "../TextEffects/VariableFont";
import { GestureHandler } from "../GestureHandler";
import Animated, { makeMutable, useSharedValue } from "react-native-reanimated";
import { deflate } from "~/lib/utils";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter } = useGlobalStore();
  const image = useImage(photo);
  const { width, height } = Dimensions.get("window");

  // Text properties
  const text = "Hello World";
  const fontSize = 44;

  // Calculate text dimensions
  const textWidth = fontSize * text.length * 0.6; // Approximate text width
  const textHeight = fontSize * 1.2; // Approximate text height

  const src = rect(0, 0, textWidth, textHeight);
  const dst = deflate(rect(0, 0, width, height), 24);
  const m3 = processTransform2d(fitbox("contain", src, dst));
  const matrix = makeMutable(m3);

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
        <Group matrix={matrix}>
          <VariableFontAnimateText
            text={text}
            xCord={0}
            yCord={fontSize} // Adjust for text baseline
            comeback
            fontSize={fontSize}
          />
        </Group>
      </Canvas>

      {/* Position gesture handler at the same position as text */}

      <GestureHandler
        debug
        matrix={matrix} // Use identity matrix since position is set by View
        size={{
          height: textHeight,
          width: textWidth,
        }}
      />
    </GestureHandlerRootView>
  );
}
