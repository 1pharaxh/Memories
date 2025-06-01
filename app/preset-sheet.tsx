import Stack from "~/components/ui/Stack";
import { ScrollView, View } from "react-native";

import React, { memo } from "react";

import FilterIcons from "~/components/ui/PresetSheetViews/FilterIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FilterType } from "~/lib/constants";
interface renderPresetSheetContentProps {
  type: string;
}

import * as AC from "@bacons/apple-colors";
import StickerSheet from "~/components/ui/PresetSheetViews/StickerSheet/StickerSheet";
import DrawSelectionSheet from "~/components/ui/PresetSheetViews/DrawSelectionSheet";
import EdgeFade from "~/components/ui/EdgeFade";

const RenderPresetSheetContent: React.FC<renderPresetSheetContentProps> = memo(
  ({ type }: renderPresetSheetContentProps) => {
    switch (type) {
      case FilterType.Filter:
        return <FilterIcons />;
      case FilterType.Stickers:
        return <StickerSheet />;
      case FilterType.Draw:
        return <DrawSelectionSheet />;
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
        <View className='relative flex-1'>
          <EdgeFade
            height={200}
            width={90}
            position='left'
            style={{ borderRadius: 0 }}
          />
          <ScrollView
            horizontal
            contentContainerStyle={{ padding: 24, gap: 32 }}
          >
            <RenderPresetSheetContent type={type || ""} />
          </ScrollView>
          <EdgeFade
            height={200}
            width={90}
            position='right'
            style={{ borderRadius: 0 }}
          />
        </View>
      ) : (
        <RenderPresetSheetContent type={type || ""} />
      )}
    </>
  );
}
