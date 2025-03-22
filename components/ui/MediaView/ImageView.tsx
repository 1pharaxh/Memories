import { Dimensions } from "react-native";

import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  Image,
  useImage,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";

import GlitchText from "../TextEffects/GlitchEffect";
import BigSmallText from "../TextEffects/BigSmall";
import FontWeightText from "../TextEffects/FontWeight";
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

      <GlitchText
        fontName="Got_Heroin"
        text="Testing a big text"
        xCord={150}
        yCord={400}
        fontSize={50}
      />

      <BigSmallText
        type="big"
        fontName="Got_Heroin"
        text="Testing a big text"
        xCord={100}
        yCord={500}
        playOnce={false}
        fontSize={50}
      />
      <BigSmallText
        type="small"
        fontName="Got_Heroin"
        text="Testing a big text"
        xCord={130}
        yCord={600}
        playOnce={false}
        fontSize={50}
      />

      <FontWeightText
        text="Testing a big text"
        xCord={40}
        yCord={700}
        fontSize={43}
      />
    </Canvas>
  );
}
