import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import Stack from "~/components/ui/Stack";
import * as AC from "@bacons/apple-colors";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { FilterType, NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import * as Form from "~/components/ui/Form";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import * as ScreenOrientation from "expo-screen-orientation";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconSymbol } from "~/components/ui/IconSymbol";
import { useNavigationState } from "@react-navigation/native";
import useGlobalStore from "~/store/globalStore";
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const { setDraw } = useGlobalStore();

  const navigationState = useNavigationState((state) => state);
  const routeName = (
    navigationState?.routes[navigationState.index]?.params as {
      type?: string;
    }
  )?.type;

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack>
          <Stack.Screen
            name='index'
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='onboarding'
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' />

          <Stack.Screen
            name='preset-sheet'
            sheet
            options={{
              headerLargeTitle: false,
              // Quarter sheet with no pulling allowed on routes other than filter sheet
              headerTransparent: false,
              sheetGrabberVisible: false,
              sheetAllowedDetents:
                // Filter sheet is vertically scrolled list
                routeName && routeName === FilterType.Filter
                  ? [0.25]
                  : routeName && routeName === FilterType.Draw
                  ? [0.5, 0.75]
                  : [0.25, 0.5],

              headerRight: () => (
                <Form.Link headerRight href='/(tabs)' dismissTo>
                  <IconSymbol
                    name='xmark.circle.fill'
                    color={AC.systemGray}
                    size={28}
                  />
                </Form.Link>
              ),
            }}
          />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
