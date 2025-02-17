import { create } from "zustand";

interface globalStoreState {
  isRecording: boolean;
  setIsRecording: (e: boolean) => void;
  reset: () => void;
  handleTakePicture: () => void;
  handleTakeVideo: (s: boolean) => void;
  setHandleTakePicture: (e: () => void) => void;
  setHandleTakeVideo: (e: (s: boolean) => void) => void;
  photo: string;
  setPhoto: (e: string) => void;
  video: string;
  setVideo: (e: string) => void;
}

// Define the store
const useGlobalStore = create<globalStoreState>((set) => ({
  isRecording: false,
  setIsRecording: (e) => set({ isRecording: e }),
  reset: () =>
    set({
      isRecording: false,
      handleTakePicture: () => {},
      handleTakeVideo: (s: boolean) => {},
      setHandleTakePicture: (e) => set({ handleTakePicture: e }),
      setHandleTakeVideo: (e: (s: boolean) => void) =>
        set({ handleTakeVideo: e }),
      photo: "",
      setPhoto: (e) => set({ photo: e }),
      video: "",
      setVideo: (e) => set({ video: e }),
    }),
  handleTakePicture: () => {},
  handleTakeVideo: () => {},
  setHandleTakePicture: (e) => set({ handleTakePicture: e }),
  setHandleTakeVideo: (e: (s: boolean) => void) => set({ handleTakeVideo: e }),
  photo: "",
  setPhoto: (e) => set({ photo: e }),
  video: "",
  setVideo: (e) => set({ video: e }),
}));

export default useGlobalStore;
