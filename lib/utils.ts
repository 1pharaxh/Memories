import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FONTS = {
  "SF-Pro": require("../assets/fonts/SF-Pro.ttf"),
  Got_Heroin: require("../assets/fonts/Got_Heroin.ttf"),
  SuperShiny: require("../assets/fonts/SuperShiny.ttf"),
  SuperWoobly: require("../assets/fonts/SuperWoobly.ttf"),
  Streetwear: require("../assets/fonts/Streetwear.otf"),
  GarciaMarquez: require("../assets/fonts/GarciaMarquez.otf"),
  "Gyrotrope-David Moles": require("../assets/fonts/Gyrotrope-David Moles.otf"),
} as const;
export type FontNames = keyof typeof FONTS;
