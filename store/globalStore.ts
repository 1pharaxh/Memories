import { create } from "zustand";

interface tappedScreenState {
  tappedScreen: string;
  showBottomTab: boolean;
  setTappedScreen: (e: string) => void;
  toggleBottomTab: () => void;
  reset: () => void;
}

// Define the store
const useGlobalStore = create<tappedScreenState>((set) => ({
  tappedScreen: "",
  showBottomTab: true,
  setTappedScreen: (e: string) => set({ tappedScreen: e }),
  toggleBottomTab: () =>
    set((state) => ({ showBottomTab: !state.showBottomTab })),
  reset: () => set({ tappedScreen: "", showBottomTab: true }),
}));

export default useGlobalStore;
