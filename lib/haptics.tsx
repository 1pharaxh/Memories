import * as Haptics from "expo-haptics";
export const triggerExpandHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error("Expand haptic error:", error);
  }
};

export const triggerCollapseHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    console.error("Collapse haptic error:", error);
  }
};

export const triggerCameraHaptic = async () => {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error("Camera haptic error:", error);
  }
};
