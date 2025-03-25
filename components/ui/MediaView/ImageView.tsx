import { Dimensions } from "react-native";

import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  Image,
  useImage,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";

import GlitchText from "../TextEffects/Glitch";
import BigSmallText from "../TextEffects/BigSmall";
import VariableFontAnimateText from "../TextEffects/VariableFont";
type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter } = useGlobalStore();
  const image = useImage(photo);

  const { width, height } = Dimensions.get("window");

  return (
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
                1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
              ]
        }
      />
    </Canvas>
  );
}
