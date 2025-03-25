import { Blend } from "./icons/Blend";
import { Crop } from "./icons/Crop";
import { Music } from "./icons/Music";
import { Brush } from "./icons/Brush";
import { Sticker } from "./icons/Sticker";
import VariableFontAnimateText from "~/components/ui/TextEffects/VariableFont";
import { FontNames } from "./utils";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const FILTER_PRESETS = [
  {
    name: "Summer",
    colorMatrix: [
      1.1, 0, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 0, 1, 0,
    ],

    gradientColors: ["#FFC300", "#FF5733"],
  },
  {
    name: "Winter",
    colorMatrix: [
      0.9, 0, 0, 0, 0, 0, 0.95, 0, 0, 0, 0, 0, 1.1, 0, 0, 0, 0, 0, 1, 0,
    ],
    gradientColors: ["#00BFFF", "#00FFFF"],
  },
  {
    name: "Vintage",
    colorMatrix: [
      0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
      0, 0, 0, 0, 0, 1, 0,
    ],
    gradientColors: ["#FFD700", "#A0522D"],
  },
  {
    name: "Nighttime",
    colorMatrix: [
      0.3, 0, 0, 0, 0, 0, 0.3, 0, 0, 0, 0, 0, 0.7, 0, 0, 0, 0, 0, 1, 0,
    ],
    gradientColors: ["#800080", "#000033"],
  },
  {
    name: "Neon",
    colorMatrix: [
      1.5, 0, 0, 0, -0.2, 0, 1.5, 0, 0, -0.2, 0, 0, 1.5, 0, -0.2, 0, 0, 0, 1, 0,
    ],
    gradientColors: ["#FF00FF", "#00FFFF"],
  },
];

export enum FilterType {
  Filter = "Filter",
  Music = "Music",
  Draw = "Draw",
  Crop = "Crop",
  Stickers = "Stickers",
}

export const PRESET_OPTIONS = [
  {
    name: "Filter",
    type: FilterType.Filter,
    sheetTitle: "Choose a filter",
    icon: <Blend size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Stickers",
    type: FilterType.Stickers,
    sheetTitle: "Choose a sticker",
    icon: <Sticker size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Music",
    type: FilterType.Music,
    sheetTitle: "Choose music to add",
    icon: <Music size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Draw",
    type: FilterType.Draw,
    sheetTitle: "Draw on your image",
    icon: <Brush size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Crop",
    type: FilterType.Crop,
    sheetTitle: "Crop your image",
    icon: <Crop size={17} strokeWidth={2} className="text-white" />,
  },
];

export enum STICKER_TYPE {
  TEXT = "text",
  IMAGE = "image",
}

export enum STICKER_TEXT_NAME {
  BLOOM = "Bloom",
  BIG = "Big",
  SMALL = "Small",
  GLITCH = "Glitch",
  RIGHTWARD = "Rightward",
  LEFTWARD = "Leftward",
}

export const STICKER_OPTIONS: SINGLE_STICKER_OPTIONS[] = [
  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.GLITCH,
    fontName: "Got_Heroin",
    fontSize: 50,
  },
  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.BLOOM,
    fontName: "SuperWoobly", // DOES NOT MATTER
    fontSize: 30,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.RIGHTWARD,
    fontName: "Gyrotrope-David Moles",
    fontSize: 35,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.LEFTWARD,
    fontName: "Gyrotrope-David Moles",
    fontSize: 35,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.BIG,
    fontName: "Gyrotrope-David Moles",
    fontSize: 30,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.SMALL,
    fontName: "Gyrotrope-David Moles",
    fontSize: 30,
  },
];

export interface SINGLE_STICKER_OPTIONS {
  type: STICKER_TYPE;
  name: STICKER_TEXT_NAME;
  fontName: FontNames;
  fontSize: number;
}
