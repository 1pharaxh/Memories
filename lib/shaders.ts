import { Skia } from "@shopify/react-native-skia";

/**
 * A Skia runtime shader that applies film grain and 3D LUT color grading.
 *
 * This shader does two main things:
 * 1. **Film Grain**: Adds subtle noise-based grain to the image based on brightness.
 *    - Controlled by `filmGrainMultiplyer`, a float between `0.0` (no grain) and `1.0` (strong grain).
 * 2. **LUT Mapping**: Applies a 3D LUT transformation using the `lutsImage`.
 *    - Converts RGB values to lookup coordinates to sample the LUT texture.
 *
 * ## Uniforms:
 * - `image`: The base image shader.
 * - `lutsImage`: A 512x512 LUT texture representing a 64x64x64 3D LUT.
 * - `resolution`: A `float2` containing the width and height of the image.
 * - `filmGrainMultiplyer`: Strength of the film grain effect (range: 0.0 to 1.0).
 */
export const lutWithFilmGrain = Skia.RuntimeEffect.Make(`
uniform shader image;
uniform shader lutsImage;
uniform float2 resolution;
uniform float filmGrainMultiplyer;
uniform float progress;
uniform float grainScale;

float gaussian(float z, float u, float o) {
  return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-((z - u) * (z - u)) / (2.0 * o * o));
}

float randomNoise(float2 uv) {
  float seed = dot(uv, float2(12.9898, 78.233));
  float noise = fract(sin(seed) * 43758.5453);
  return gaussian(noise, 0.0, 0.25);
}

half4 main(float2 xy) {
  float2 uv = xy / resolution;
  vec4 color = image.eval(xy);

  // === Film Grain ===
  float2 grainUV = floor(uv * (resolution / grainScale)) / (resolution / grainScale);

  float noise = randomNoise(grainUV + float2(0.0, progress / 100.0));
  float3 grain = float3(noise) * (1.0 - color.rgb);
  color.rgb += grain * filmGrainMultiplyer;

  // === LUT Mapping ===

  int r = int(color.r * 255.0 / 4);
  int g = int(color.g * 255.0 / 4);
  int b = int(color.b * 255.0 / 4);
  
  float lutX = float(int(mod(float(b), 8.0)) * 64 + r);
  float lutY = float(int((b / 8) * 64 + g));
  
  vec4 lutsColor = lutsImage.eval(float2(lutX, lutY));
  return lutsColor;
}

`)!;

/**
 * A Skia runtime shader that creates a *fractal glass* distortion effect.
 *
 * This shader simulates vertical bands (stripes) that displace pixels horizontally,
 * mimicking a wavy glass or heatwave effect.
 *
 * ## Behavior:
 * - The image is horizontally compressed by 3% (`adjustedXY.x * 0.97`).
 * - The `fractal_glass` function samples multiple horizontal displacements for each x-position,
 *   creating a smooth distortion influenced by nearby positions.
 *
 * ## Uniforms:
 * - `image`: The input image shader to be distorted.
 * - `NUM_STRIPES`: Controls how many vertical bands appear across the screen.
 * - `STRENGTH`: The maximum horizontal displacement applied within each band.
 * - `SOFTNESS`: Controls blending between stripes; higher values smooth the distortion.
 * - `resolution`: A `float2` representing the image's width and height in pixels.
 */
export const FractalGlass = Skia.RuntimeEffect.Make(`
  uniform shader image;

  uniform float NUM_STRIPES;   // number of bands across the screen
  uniform float STRENGTH;      // max displacement in pixels
  uniform float SOFTNESS;
  uniform float2 resolution;

  float displacement(float x, float num_stripes, float strength) {
    float modulus = resolution.x / num_stripes;
    return mod(x, modulus) * (strength / modulus);
  }

  float fractal_glass(float x) {
    float d = 0.0;
    for (int i = -5; i <= 5; i++) {
       d += displacement(x + float(i) * SOFTNESS, NUM_STRIPES, STRENGTH);
    }
    d = d / 11.0;
    return x + d;
  }

  float4 main(float2 xy) {
    float2 adjustedXY = xy;
     adjustedXY.x =  adjustedXY.x * 0.97;
    adjustedXY.x = fractal_glass(adjustedXY.x);
    

    return image.eval(adjustedXY);
  }

`)!;

/**
 * A Skia runtime shader that applies a **grayscale RGB shift** effect.
 *
 * ## Behavior:
 * - Converts the image to grayscale using the length of the RGB vector.
 * - Applies a horizontal RGB split:
 *   - Red channel samples from a slightly right-shifted pixel.
 *   - Green channel remains unshifted.
 *   - Blue channel samples from a slightly left-shifted pixel.
 * - The result is a grayscale image with subtle color fringing (RGB shift) that simulates
 *   chromatic aberration or old TV effects.
 *
 * ## Uniforms:
 * - `image`: The input image shader to be distorted.
 * - `resolution`: The width and height of the image (currently unused).
 * - `shift`: The number of pixels to shift the red and blue channels horizontally.
 */
export const GreyScaleRgbShift = Skia.RuntimeEffect.Make(`
uniform shader image;
uniform float2 resolution;
uniform float shift;

float4 main(float2 xy) {
    // Sample grayscale from each shifted location
    float3 colR = image.eval(xy + float2(shift, 0.0)).rgb;
    float3 colG = image.eval(xy).rgb;
    float3 colB = image.eval(xy - float2(shift, 0.0)).rgb;

    float grayR = length(colR) / sqrt(3.0);
    float grayG = length(colG) / sqrt(3.0);
    float grayB = length(colB) / sqrt(3.0);

    // Build grayscale RGB with shifted channels
    float3 col = float3(grayR, grayG, grayB);

    return float4(col, 1.0);
}
`)!;
