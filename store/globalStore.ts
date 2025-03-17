import { create, StateCreator } from "zustand";

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

export interface AnimatedText {
  startTime: number;
  endTime: number;
  text: string;
  position: XYPosition;
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

export interface Sticker {
  imageUrl: string;
  position: XYPosition;
  // Optional: scale factor for the sticker
  scale?: number;
  // Optional: rotation angle in degrees
  rotation?: number;
  isAnimated?: boolean;
  startTime?: number;
  endTime?: number;
}

export interface PresetSlice {
  filter?: Filter;
  text?: AnimatedText[];
  crop?: Crop;
  draw?: Draw[];
  stickers?: Sticker[];
  setFilter: (filter: Filter) => void;
  setText: (text: AnimatedText[]) => void;
  setCrop: (crop: Crop) => void;
  setDraw: (draw: Draw[]) => void;
  setStickers: (stickers: Sticker[]) => void;
}

const createPresetSlice: StateCreator<PresetSlice, [], [], PresetSlice> = (
  set
) => ({
  filter: {
    name: "",
    colorMatrix: [],
  },
  text: [],
  crop: {
    position: { x: 0, y: 0 },
    width: 1,
    height: 1,
  },
  draw: [],
  stickers: [],
  setFilter: (filter) => set({ filter }),
  setText: (text) => set({ text }),
  setCrop: (crop) => set({ crop }),
  setDraw: (draw) => set({ draw }),
  setStickers: (stickers) => set({ stickers }),
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
