import { Animated, View, TouchableOpacity, Platform, Text } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Link } from "expo-router";

export default function MyTabBar({
  state,
  descriptors,
  navigation,
  position,
}: {
  state: any;
  descriptors: any;
  navigation: any;
  position: any;
}) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View className="flex flex-row absolute bottom-10 items-center justify-center w-full">
      <View className="flex flex-row gap-2">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_: any, i: any) => i);

          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i: number) =>
              i === index ? 1 : 0.75
            ),
          });

          return (
            <TouchableOpacity
              className=" px-4 py-2 rounded-lg text-center flex items-center justify-center "
              key={route.name}
              accessibilityRole={Platform.OS === "web" ? "link" : "button"}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              <Animated.Text
                className="text-xl bg-red-500"
                style={{ opacity, color: colors.text }}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
