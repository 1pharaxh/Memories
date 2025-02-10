import { router } from "expo-router";
import * as React from "react";
import { Text, View, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl mb-4">Home Screen</Text>
      <Pressable
        onPress={() => router.replace("/onboarding")}
        className="bg-primary px-4 py-2 rounded-lg"
      >
        <Text className="text-primary-foreground">Back to onboarding</Text>
      </Pressable>
    </View>
  );
}
