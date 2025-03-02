import { create } from "zustand";

interface globalStoreState {
  isRecording: boolean;
  photo: string;
  video: string;
  cameraMode: "picture" | "video";
  fragmentShader: string;
  setfragmentShader: (e: string) => void;
  setCameraMode: (e: "picture" | "video") => void;
  setIsRecording: (e: boolean) => void;
  reset: () => void;
  handleTakePicture: () => void;
  handleTakeVideo: () => void;
  setHandleTakePicture: (e: () => void) => void;
  setHandleTakeVideo: (e: () => void) => void;
  setPhoto: (e: string) => void;
  setVideo: (e: string) => void;
}

// Define the store
const useGlobalStore = create<globalStoreState>((set) => ({
  isRecording: false,
  photo: "",
  video: "",
  cameraMode: "picture",
  fragmentShader: "",
  setfragmentShader: (e) => set({ fragmentShader: e }),
  setCameraMode: (e: "picture" | "video") => set({ cameraMode: e }),
  setIsRecording: (e) => set({ isRecording: e }),
  reset: () =>
    set({
      isRecording: false,
      handleTakePicture: () => {},
      handleTakeVideo: () => {},
      setHandleTakePicture: (e) => set({ handleTakePicture: e }),
      setHandleTakeVideo: (e: () => void) => set({ handleTakeVideo: e }),
      photo: "",
      setPhoto: (e) => set({ photo: e }),
      video: "",
      setVideo: (e) => set({ video: e }),
    }),
  handleTakePicture: () => {},
  handleTakeVideo: () => {},
  setHandleTakePicture: (e) => set({ handleTakePicture: e }),
  setHandleTakeVideo: (e: () => void) => set({ handleTakeVideo: e }),

  setPhoto: (e) => set({ photo: e }),
  setVideo: (e) => set({ video: e }),
}));

export default useGlobalStore;
