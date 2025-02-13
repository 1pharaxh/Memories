import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Dimensions, SafeAreaView, View } from "react-native";
import MyTabBar from "~/components/ui/TabBar";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <View className="flex-1">
      <MaterialTopTabs
        tabBarPosition="bottom"
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{
            title: "Tab One",
          }}
        />
        <MaterialTopTabs.Screen name="gallery" options={{ title: "Tab Two" }} />
      </MaterialTopTabs>
    </View>
  );
}
