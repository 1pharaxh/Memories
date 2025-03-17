import Stack from "~/components/ui/Stack";
import { ScrollView } from "react-native";

import React, { memo } from "react";

import FilterIcons from "~/components/ui/FilterIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FilterType } from "~/lib/constants";
interface renderPresetSheetContentProps {
  type: string;
}
const RenderPresetSheetContent: React.FC<renderPresetSheetContentProps> = memo(
  ({ type }: renderPresetSheetContentProps) => {
    switch (type) {
      case FilterType.Filter:
        return <FilterIcons />;
      default:
        return null;
    }
  }
);

export default function Page() {
  // get quey params
  const { type, sheetTitle } = useLocalSearchParams<{
    type?: string;
    sheetTitle?: string;
  }>();

  return (
    <>
      <Stack.Screen options={{ title: sheetTitle }} />
      <ScrollView horizontal contentContainerStyle={{ padding: 24, gap: 32 }}>
        <RenderPresetSheetContent type={type || ""} />
      </ScrollView>
    </>
  );
}
