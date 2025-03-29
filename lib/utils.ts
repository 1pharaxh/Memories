import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SkMatrix, Vector } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";

import type { SkRect } from "@shopify/react-native-skia";
import { rect } from "@shopify/react-native-skia";

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
