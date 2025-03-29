import { SkMatrix } from "@shopify/react-native-skia";
import { Mutable } from "react-native-reanimated/lib/typescript/commonTypes";
import { create, StateCreator } from "zustand";
import { SINGLE_STICKER_OPTIONS } from "~/lib/constants";

/*Store to handle Captured media related operations*/

interface MediaSlice {
  photo: string;
  video: string;
  setPhoto: (e: string) => void;
  setVideo: (e: string) => void;
}
const createMediaSlice: StateCreator<MediaSlice, [], [], MediaSlice> = (
  set
) => ({
  photo: "",
  video: "",
  setPhoto: (e) => set({ photo: e }),
  setVideo: (e) => set({ video: e }),
});

/*Store to handle Camera related operations*/

interface CameraSlice {
  cameraMode: "picture" | "video";
  setCameraMode: (e: "picture" | "video") => void;
  isRecording: boolean;
  setIsRecording: (e: boolean) => void;
}

const createCameraSlice: StateCreator<CameraSlice, [], [], CameraSlice> = (
  set
) => ({
  cameraMode: "picture",
  setCameraMode: (e) => set({ cameraMode: e }),
  isRecording: false,
  setIsRecording: (e) => set({ isRecording: e }),
});

/*Store to keep and pass camera related functions*/

interface ActionSlice {
  handleTakePicture: () => void;
  handleTakeVideo: () => void;
  setHandleTakePicture: (e: () => void) => void;
  setHandleTakeVideo: (e: () => void) => void;
}

const createActionSlice: StateCreator<ActionSlice, [], [], ActionSlice> = (
  set
) => ({
  handleTakePicture: () => {},
  handleTakeVideo: () => {},
  setHandleTakePicture: (e) => set({ handleTakePicture: e }),
  setHandleTakeVideo: (e) => set({ handleTakeVideo: e }),
});

/*Store to keep and pass image filter related information*/

interface ShaderSlice {
  fragmentShader: string;
  setfragmentShader: (e: string) => void;
}

const createShaderSlice: StateCreator<ShaderSlice, [], [], ShaderSlice> = (
  set
) => ({
  fragmentShader: "",
  setfragmentShader: (e) => set({ fragmentShader: e }),
});

/* WORK IN PROGRESS */

export interface XYPosition {
  x: number;
  y: number;
}

export interface Filter {
  name: string;
  colorMatrix: number[];
}

export interface Crop {
  // Top-left coordinate of the crop region
  position: XYPosition;
  width: number;
  height: number;
}

export interface Draw {
  color: string;
  position: XYPosition;
  // Represents the brush size
  radius: number;
  isAnimated?: boolean;
  startTime?: number;
  endTime?: number;
}

export type GLOBALS_SINGLE_STICKER_OPTIONS = SINGLE_STICKER_OPTIONS & {
  matrix: Mutable<SkMatrix>;
  fontSize: number;
  text: string;
  height: number;
  width: number;
};

export interface PresetSlice {
  filter?: Filter;
  crop?: Crop;
  draw?: Draw[];
  stickers?: GLOBALS_SINGLE_STICKER_OPTIONS[];
  setFilter: (filter: Filter) => void;
  setCrop: (crop: Crop) => void;
  setDraw: (draw: Draw[]) => void;
  addStickers: (sticker: GLOBALS_SINGLE_STICKER_OPTIONS) => void;
}

const createPresetSlice: StateCreator<PresetSlice, [], [], PresetSlice> = (
  set
) => ({
  filter: {
    name: "",
    colorMatrix: [],
  },
  crop: {
    position: { x: 0, y: 0 },
    width: 1,
    height: 1,
  },
  draw: [],
  stickers: [],
  setFilter: (filter) => set({ filter }),
  setCrop: (crop) => set({ crop }),
  setDraw: (draw) => set({ draw }),
  addStickers: (sticker) =>
    set((state) => ({ stickers: [...(state.stickers || []), sticker] })),
});

/*Global store builds upon and combines all the slices*/

const useGlobalStore = create<
  MediaSlice & CameraSlice & ActionSlice & ShaderSlice & PresetSlice
>()((...a) => ({
  ...createMediaSlice(...a),
  ...createCameraSlice(...a),
  ...createActionSlice(...a),
  ...createShaderSlice(...a),
  ...createPresetSlice(...a),
}));

export default useGlobalStore;
