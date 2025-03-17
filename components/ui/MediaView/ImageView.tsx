import { Dimensions } from "react-native";

import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  Image,
  useImage,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";

// remove the children props from CanvasProps
type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter } = useGlobalStore();
  const image = useImage(photo);
  const { width, height } = Dimensions.get("window");
  if (!image) return null;

  return (
    <Canvas style={{ flex: 1 }} {...rest}>
      <Image
        x={0}
        y={0}
        width={width}
        height={height}
        image={image}
        fit="cover"
      >
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
      </Image>
    </Canvas>
  );
}
