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
        text="Glitch Effect"
        xCord={150}
        yCord={400}
        fontSize={50}
      />

      <BigSmallText
        type="big"
        fontName="Gyrotrope-David Moles"
        text="Big text"
        xCord={50}
        yCord={500}
        playOnce={false}
        fontSize={35}
      />
      <BigSmallText
        type="small"
        fontName="Streetwear"
        text="Small text"
        xCord={130}
        yCord={600}
        playOnce={false}
        fontSize={35}
      />

      <FontWeightText
        text="Variable Font Animations"
        xCord={40}
        yCord={700}
        fontSize={35}
      />
    </Canvas>
  );
}
