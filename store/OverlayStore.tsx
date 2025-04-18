import { useCallback } from "react";
import { type SharedValue, makeMutable } from "react-native-reanimated";
import { create } from "zustand";

export interface ImmersiveOverlayState {
	displayImmersiveOverlay: SharedValue<boolean>;
	contentComponent: React.ReactNode | null;
	colors: {
		primary: string;
		secondary: string;
		expanding: {
			dark: string[];
			light: string[];
		};
	};
}

const DEFAULT_COLORS = {
	primary: "#5465ff",
	secondary: "#5465ff",

	/**
	 * This gives a little bit of flexibility to the colors. We keep it as an array
	 * so that we interpolate between them. Our generateColors fn handles returning the
	 * proper colors for the expanding circle.
	 */
	expanding: {
		dark: ["orange", "red", "#5465ff"],
		light: ["orange", "red", "#0077b6"],
	},
};

// This example uses zustand, but I also assume you can use react context if you'd like.
// Used zustand bc it was just convenient for me lol
export const useImmersiveOverlayStore = create<ImmersiveOverlayState>(() => ({
	// Read up on this just in case, this is how we're storing a shared value globally.
	//https://docs.swmansion.com/react-native-reanimated/docs/advanced/makeMutable/
	displayImmersiveOverlay: makeMutable(false),
	contentComponent: null,
	colors: DEFAULT_COLORS,
}));

// Hook
export function useImmersiveOverlay() {
	const store = useImmersiveOverlayStore();

	/*** The function that allows us to add custom components, colors, and display our overlay.*/
	const immerse = useCallback(
		({
			component,
			colors,
		}: {
			component?: React.ReactNode;
			colors?: typeof DEFAULT_COLORS;
		} = {}) => {
			useImmersiveOverlayStore.setState((state) => ({
				...state,
				contentComponent: component ?? null,
				colors: colors ?? DEFAULT_COLORS,
			}));

			store.displayImmersiveOverlay.value = true;
		},
		[store.displayImmersiveOverlay],
	);

	// Function to dismiss the immersive overlay
	const dismiss = useCallback(() => {
		store.displayImmersiveOverlay.value = false;
	}, [store.displayImmersiveOverlay]);

	return {
		immerse,
		dismiss,
		displayImmersiveOverlay: store.displayImmersiveOverlay,
	};
}
