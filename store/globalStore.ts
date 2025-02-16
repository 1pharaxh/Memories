import { create } from "zustand";

interface globalStoreState {
  isRecording: boolean;
  setIsRecording: (e: boolean) => void;
  reset: () => void;
}

// Define the store
const useGlobalStore = create<globalStoreState>((set) => ({
  isRecording: false,
  setIsRecording: (e) => set({ isRecording: e }),
  reset: () => set({ isRecording: false }),
}));

export default useGlobalStore;
