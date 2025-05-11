import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SkMatrix, Vector } from "@shopify/react-native-skia";
import { Skia, useFont } from "@shopify/react-native-skia";

import type { SkRect } from "@shopify/react-native-skia";
import { rect } from "@shopify/react-native-skia";
import { FontNames, FONTS } from "./constants";
import color from "tinycolor2";
import type { ImmersiveOverlayState } from "~/store/OverlayStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const scale = (matrix: SkMatrix, s: number, origin: Vector) => {
  "worklet";
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.scale(s, s);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const rotateZ = (matrix: SkMatrix, theta: number, origin: Vector) => {
  "worklet";
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.rotate(theta);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const translate = (matrix: SkMatrix, x: number, y: number) => {
  "worklet";
  const m = Skia.Matrix();
  m.translate(x, y);
  m.concat(matrix);
  return m;
};

export const inflate = (rct: SkRect, amount: number) =>
  rect(
    rct.x - amount,
    rct.y - amount,
    rct.width + amount * 2,
    rct.height + amount * 2
  );

export const deflate = (rct: SkRect, amount: number) =>
  rect(
    rct.x + amount,
    rct.y + amount,
    rct.width - amount * 2,
    rct.height - amount * 2
  );

/**Utility function that helps us render the proper colors for the overlay */
/**Note, i think this is a bit ugly, please be my guest to refactor it! */

export const generateColors = (colors: ImmersiveOverlayState["colors"]) => {
  //The last color will be our transparent color (alpha of (0.2)), so we seperate this from the others
  // The reason for this is because we want this color to be our new background color, you could also opt to just completely setting it to 0.
  const darkColors = colors?.expanding?.dark?.slice(0, -1);
  const lastDarkColor =
    colors?.expanding?.dark?.[colors?.expanding?.dark?.length - 1];

  const lightColors = colors?.expanding?.light?.slice(0, -1);
  const lastLightColor =
    colors?.expanding?.light?.[colors?.expanding?.light?.length - 1];

  return {
    primary: colors?.primary || "#5465ff",
    secondary: colors?.secondary || "#5465ff",
    expanding: {
      dark: [
        // All other colors are 95% opacity, the last one is 100% opacity
        ...(darkColors || []).map((c) => color(c).setAlpha(0.95).toRgbString()),
        // Also add the last color with 100% opacity
        color(lastDarkColor || "#5465ff")
          .setAlpha(0.95)
          .toRgbString(),
        // Also add the last color with 20% opacity
        color(lastDarkColor || "#5465ff")
          .setAlpha(0.2)
          .toRgbString(),
      ],
      light: [
        ...(lightColors || []).map((c) =>
          color(c).setAlpha(0.95).toRgbString()
        ),
        color(lastLightColor || "#0077b6")
          .setAlpha(0.95)
          .toRgbString(),
        color(lastLightColor || "#0077b6")
          .setAlpha(0.2)
          .toRgbString(),
      ],
    },
  };
};
