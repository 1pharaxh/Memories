import Stack from "~/components/ui/Stack";
import { ScrollView } from "react-native";

import React, { memo } from "react";

import FilterIcons from "~/components/ui/PresetSheetViews/FilterIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FilterType } from "~/lib/constants";
interface renderPresetSheetContentProps {
  type: string;
}

import * as AC from "@bacons/apple-colors";
import StickerSheet from "~/components/ui/PresetSheetViews/StickerSheet";
import ColorSelectionSheet from "~/components/layout/ColorSelectionSheet";

const RenderPresetSheetContent: React.FC<renderPresetSheetContentProps> = memo(
  ({ type }: renderPresetSheetContentProps) => {
    switch (type) {
      case FilterType.Filter:
        return <FilterIcons />;
      case FilterType.Stickers:
        return <StickerSheet />;
      case FilterType.Draw:
        return <ColorSelectionSheet />;
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
      <Stack.Screen
        options={{
          title: sheetTitle,
          contentStyle: {
            backgroundColor: AC.tertiarySystemGroupedBackground,
          },
        }}
      />
      {type === FilterType.Filter ? (
        <ScrollView horizontal contentContainerStyle={{ padding: 24, gap: 32 }}>
          <RenderPresetSheetContent type={type || ""} />
        </ScrollView>
      ) : (
        <RenderPresetSheetContent type={type || ""} />
      )}
    </>
  );
}
