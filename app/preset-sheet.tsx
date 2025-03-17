import Stack from "~/components/ui/Stack";
import { ScrollView } from "react-native";

import React from "react";

import FilterIcons from "~/components/ui/FilterIcons";

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ title: "Choose a preset" }} />
      <ScrollView horizontal contentContainerStyle={{ padding: 24, gap: 32 }}>
        <FilterIcons />
      </ScrollView>
    </>
  );
}
