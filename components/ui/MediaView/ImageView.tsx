import { Dimensions } from "react-native";

import {
  Canvas,
  CanvasProps,
  ColorMatrix,
  Glyphs,
  Image,
  useFont,
  useImage,
  vec,
  Group,
} from "@shopify/react-native-skia";
import useGlobalStore from "~/store/globalStore";
import { useEffect, useMemo } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// remove the children props from CanvasProps
type ImageViewProps = Omit<CanvasProps, "children"> & {};

export default function ImageView(props: ImageViewProps) {
  const { ...rest } = props;
  const { photo, filter } = useGlobalStore();
  const image = useImage(photo);
  const fontSize = 32;
  const font = useFont(require("../../../assets/fonts/SF-Pro.ttf"), fontSize);

  const { width, height } = Dimensions.get("window");

  const glyphs = useMemo(() => {
    if (!font) return [];
    return font
      .getGlyphIDs("Hello World!")
      .map((id, i) => ({ id, pos: vec(i * (fontSize - 2), fontSize) }));
  }, [font]);

  const size = 500;
  const r = useSharedValue(0);
  const c = useDerivedValue(() => size - r.value);
  useEffect(() => {
    r.value = withRepeat(withTiming(size * 0.33, { duration: 2000 }), -1);
  }, [r, size]);

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

      <Glyphs
        // some padding from left
        x={width - width * 0.9}
        y={c}
        font={font}
        color={"#3f2"}
        glyphs={glyphs}
      />
    </Canvas>
  );
}
