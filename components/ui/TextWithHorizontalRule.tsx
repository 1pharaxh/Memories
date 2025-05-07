import React from "react";
import { Text, View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";

type Props = ViewProps & {
  text: string;
};

const TextWithHorizontalRule = (props: Props) => {
  const { text, ...rest } = props;
  return (
    <View
      className={cn(
        rest.className,
        "flex flex-row items-center justify-center gap-4"
      )}
      {...rest}
    >
      <View className="flex-1 h-[2px] bg-muted-foreground/20" />
      <Text className="text-muted-foreground text-lg font-medium px-2">
        {text}
      </Text>
      <View className="flex-1 h-[2px] bg-muted-foreground/20" />
    </View>
  );
};

export default TextWithHorizontalRule;
