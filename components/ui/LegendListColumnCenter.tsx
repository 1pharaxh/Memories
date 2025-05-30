import { Group } from "@shopify/react-native-skia";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const getItemStyle = (index: number, numColumns: number) => {
  const alignItems = (() => {
    if (numColumns < 2 || index % numColumns === 0) return "flex-start";
    if ((index + 1) % numColumns === 0) return "flex-end";

    return "center";
  })();

  return {
    alignItems,
    width: "100%",
  } as const;
};

type ColumnItemProps = ViewProps & {
  children: React.ReactNode;
  index: number;
  numColumns: number;
};
const LegendListColumnCenter = ({
  children,
  index,
  numColumns,
  ...rest
}: ColumnItemProps) => (
  <View
    style={StyleSheet.flatten([getItemStyle(index, numColumns), rest.style])}
    {...rest}
  >
    {children}
  </View>
);

export default LegendListColumnCenter;

export const CenteredSkiaContent = ({
  width,
  height,
  children,
  scale = 1,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
  scale?: number;
}) => {
  // The Group component can be used to transform all children
  return (
    <Group
      transform={[
        { translateX: (width * scale) / 2 },
        { translateY: (height * scale) / 2 },
        { scale: scale },
      ]}
    >
      {children}
    </Group>
  );
};
