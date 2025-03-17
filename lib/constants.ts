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
