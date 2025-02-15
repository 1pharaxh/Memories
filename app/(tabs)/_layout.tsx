import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { View } from "react-native";
import MyTabBar from "~/components/ui/TabBar";
import useGlobalStore from "~/store/globalStore";
import { TabBarIcon } from "~/components/ui/TabBarIcon";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  const { setShowTab } = useGlobalStore();
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
          listeners={({ navigation }) => ({
            swipeEnd: (e) => {
              setShowTab(false);
            },
            tabPress: (e) => {
              console.log("First Tab");
            },
          })}
        />
        <MaterialTopTabs.Screen
          listeners={({ navigation }) => ({
            swipeEnd: (e) => {
              setShowTab(false);
            },
            tabPress: (e) => {
              console.log("Second Tab");
            },
          })}
          name="gallery"
          options={{
            title: "Tab Two",
          }}
        />
      </MaterialTopTabs>
    </View>
  );
}
