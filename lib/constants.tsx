import { Blend } from "./icons/Blend";
import { Crop } from "./icons/Crop";
import { Music } from "./icons/Music";
import { Brush } from "./icons/Brush";
import { Sticker } from "./icons/Sticker";
import { FractalGlass, GreyScaleRgbShift, lutWithFilmGrain } from "./shaders";
import { Filter } from "~/store/globalStore";

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
    sheetTitle: "Filters",
    icon: <Blend size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Stickers",
    type: FilterType.Stickers,
    sheetTitle: "Stickers",
    icon: <Sticker size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Music",
    type: FilterType.Music,
    sheetTitle: "Music",
    icon: <Music size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Draw",
    type: FilterType.Draw,
    sheetTitle: "Draw",
    icon: <Brush size={17} strokeWidth={2} className="text-white" />,
  },
  {
    name: "Crop",
    type: FilterType.Crop,
    sheetTitle: "Crop your image",
    icon: <Crop size={17} strokeWidth={2} className="text-white" />,
  },
];

export const FONTS = {
  "SF-Pro": require("../assets/fonts/SF-Pro.ttf"),
  Got_Heroin: require("../assets/fonts/Got_Heroin.ttf"),
  SuperShiny: require("../assets/fonts/SuperShiny.ttf"),
  SuperWoobly: require("../assets/fonts/SuperWoobly.ttf"),
  Streetwear: require("../assets/fonts/Streetwear.otf"),
  GarciaMarquez: require("../assets/fonts/GarciaMarquez.otf"),
  "Gyrotrope-David Moles": require("../assets/fonts/Gyrotrope-David Moles.otf"),
  "Beyond Wonderland": require("../assets/fonts/Beyond Wonderland.ttf"),
  "Cocaine sans - chris hansen": require("../assets/fonts/Cocaine sans - chris hansen.ttf"),
  OverusedGrotesk: require("../assets/fonts/Overused-Grotesk/OverusedGrotesk-Medium.ttf"),
} as const;
export type FontNames = keyof typeof FONTS;
export const FONT_TO_FONTNAMES = {
  "SF-Pro": { name: "Apple", size: 36, yOffshootDividend: 4 },
  Got_Heroin: { name: "Retro", size: 52, yOffshootDividend: 4 },
  SuperShiny: { name: "Shiny", size: 42, yOffshootDividend: 4 },
  SuperWoobly: { name: "Woobly", size: 28, yOffshootDividend: 3 },
  Streetwear: { name: "Street", size: 32, yOffshootDividend: 2 },
  GarciaMarquez: { name: "Garcia", size: 40, yOffshootDividend: 3 },
  "Gyrotrope-David Moles": {
    name: "Gyrotrope",
    size: 36,
    yOffshootDividend: 3,
  },
  "Beyond Wonderland": { name: "Wonderland", size: 40, yOffshootDividend: 3 },
  "Cocaine sans - chris hansen": {
    name: "Dirty",
    size: 52,
    yOffshootDividend: 4,
  },
  OverusedGrotesk: { name: "Overused", size: 36, yOffshootDividend: 3 },
};

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
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/Art Text Sticker by Matt Osio.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/I Love You Animation Sticker by Matt Osio.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/Meh Over It Sticker by V5MT.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/Text Please Sticker by V5MT.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/Thank U Sticker by V5MT.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.IMAGE,
    name: require("../assets/gifs/the wave dancing Sticker.gif"),
    fontSize: 30,
  },
  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.GLITCH,
    fontName: "Got_Heroin",
    fontSize: 50,
  },
  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.BLOOM,
    fontName: "OverusedGrotesk",
    fontSize: 30,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.RIGHTWARD,
    fontName: "OverusedGrotesk",
    fontSize: 35,
  },

  {
    type: STICKER_TYPE.TEXT,
    name: STICKER_TEXT_NAME.LEFTWARD,
    fontName: "OverusedGrotesk",
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
  name: STICKER_TEXT_NAME | string;
  fontName?: FontNames;
  fontSize: number;
  isGif?: boolean;
}
export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export interface STICKER_TABS_INTERFACE {
  name: string;
  icon: React.JSX.Element;
  stickers: SINGLE_STICKER_OPTIONS[];
}

export const STICKER_TABS: STICKER_TABS_INTERFACE[] = [
  {
    name: "Animated texts",
    icon: <Blend strokeWidth={2} size={30} className="text-muted-foreground" />,
    stickers: [
      {
        type: STICKER_TYPE.TEXT,
        name: STICKER_TEXT_NAME.GLITCH,
        fontName: "Got_Heroin",
        fontSize: 50,
      },
      {
        type: STICKER_TYPE.TEXT,
        name: STICKER_TEXT_NAME.BLOOM,
        fontName: "OverusedGrotesk",
        fontSize: 30,
      },

      {
        type: STICKER_TYPE.TEXT,
        name: STICKER_TEXT_NAME.RIGHTWARD,
        fontName: "OverusedGrotesk",
        fontSize: 35,
      },

      {
        type: STICKER_TYPE.TEXT,
        name: STICKER_TEXT_NAME.LEFTWARD,
        fontName: "OverusedGrotesk",
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
    ],
  },
  {
    name: "XYZ Images",
    icon: <Brush strokeWidth={2} size={30} className="text-muted-foreground" />,
    stickers: [
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/Text Please Sticker by V5MT.gif"),
        isGif: true,
        fontSize: 30,
      },
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/Thank U Sticker by V5MT.gif"),
        isGif: true,
        fontSize: 30,
      },
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/the wave dancing Sticker.gif"),
        isGif: true,
        fontSize: 30,
      },
    ],
  },

  {
    name: "ABC Images",
    icon: <Crop strokeWidth={2} size={30} className="text-muted-foreground" />,
    stickers: [
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/Art Text Sticker by Matt Osio.gif"),
        isGif: true,
        fontSize: 30,
      },
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/I Love You Animation Sticker by Matt Osio.gif"),
        isGif: true,
        fontSize: 30,
      },
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/Meh Over It Sticker by V5MT.gif"),
        isGif: true,
        fontSize: 30,
      },
    ],
  },

  {
    name: "VNG Images",
    icon: <Crop strokeWidth={2} size={30} className="text-muted-foreground" />,
    stickers: [
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/I Love You Animation Sticker by Matt Osio.gif"),
        isGif: true,
        fontSize: 30,
      },
      {
        type: STICKER_TYPE.IMAGE,
        name: require("../assets/gifs/Meh Over It Sticker by V5MT.gif"),
        isGif: true,
        fontSize: 30,
      },
    ],
  },
];

export const colors: [string, string, ...string[]] = [
  "#FF69B4", // Hot Pink
  "#FF6B6B", // Coral Red
  "#FF8C42", // Dark Orange
  "#FFA726", // Orange
  "#66BB6A", // Light Green
  "#4FC3F7", // Light Blue
  "#7986CB", // Blue Grey
  "#BA68C8", // Purple
  "#F06292", // Pink
  "#4DB6AC", // Teal
  "#9575CD", // Deep Purple
  "#FF7043", // Deep Orange
  "#FFB74D", // Amber
  "#4DD0E1", // Cyan
  "#81C784", // Green
  "#7E57C2", // Deep Purple
  "#FF8A65", // Deep Orange
];

export const FILTER_PRESETS: Filter[] = [
  {
    name: "None",
    primaryShader: null,
    secondaryShader: null,
    lutImage: null,
  },
  {
    name: "Fractal",
    primaryShader: FractalGlass,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/kodak_5295_fuji_3510.png"),
  },
  {
    name: "Gray scale",
    primaryShader: GreyScaleRgbShift,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/kodak_5295_fuji_3510.png"),
  },

  {
    name: "Luts 1",
    primaryShader: null,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/candlelight.png"),
  },
  {
    name: "Luts 2",
    primaryShader: null,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/drop_blues.png"),
  },
  {
    name: "Luts 3",
    primaryShader: null,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/edgy_amber.png"),
  },

  {
    name: "Luts 4",
    primaryShader: null,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/futuristic_bleak.png"),
  },

  {
    name: "Luts 5",
    primaryShader: null,
    secondaryShader: lutWithFilmGrain,
    lutImage: require("../assets/images/luts/kodak_5295_fuji_3510.png"),
  },
];
