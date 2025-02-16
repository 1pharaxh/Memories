import Stack from "~/components/ui/Stack";
import { Text, View } from "react-native";

import * as Form from "~/components/ui/Form";

export default function Layout({ segment }: { segment: string }) {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            presentation: "modal",
            gestureEnabled: true,
            headerLargeTitle: true,
            headerTransparent: true,
            headerShown: true,
            headerRight: () => (
              <Form.Link headerRight bold href="/(tabs)/profile" dismissTo>
                Done
              </Form.Link>
            ),
          }}
        />
      </Stack>
    </View>
  );
}
