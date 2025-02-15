import { create } from "zustand";

interface tappedScreenState {
  showBottomTab: boolean;
  toggleBottomTab: () => void;
  setShowTab: (e: boolean) => void;
  reset: () => void;
}

// Define the store
const useGlobalStore = create<tappedScreenState>((set) => ({
  showBottomTab: true,
  toggleBottomTab: () =>
    set((state) => ({ showBottomTab: !state.showBottomTab })),
  setShowTab: (e: boolean) => set({ showBottomTab: e }),
  reset: () => set({ showBottomTab: true }),
}));

export default useGlobalStore;
