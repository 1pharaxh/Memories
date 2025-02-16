import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { View } from "react-native";
import MyTabBar from "~/components/ui/TabBar";
import * as AC from "@bacons/apple-colors";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
import { Aperture } from "~/lib/icons/Aperture";
import { UserRound } from "~/lib/icons/UserRound";
import { Sparkles } from "~/lib/icons/Sparkles";
export default function TabLayout() {
  return (
    <View className="flex-1">
      <MaterialTopTabs
        initialRouteName="index"
        tabBarPosition="bottom"
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <MaterialTopTabs.Screen
          name="gallery"
          options={{
            title: "Memories",
            sceneStyle: {
              backgroundColor: AC.systemGroupedBackground,
            },
            tabBarIcon: () => {
              return (
                <Sparkles size={17} strokeWidth={2} className="text-white" />
              );
            },
          }}
        />

        <MaterialTopTabs.Screen
          name="index"
          options={{
            title: "Snap",
            tabBarIcon: ({ focused, color }) => (
              <Aperture size={17} strokeWidth={2} className="text-white" />
            ),
          }}
        />

        <MaterialTopTabs.Screen
          name="profile"
          options={{
            sceneStyle: {
              backgroundColor: "transparent",
              height: "1000%",
            },
            title: "My Hub",
            tabBarIcon: () => {
              return (
                <UserRound size={17} strokeWidth={2} className="text-white" />
              );
            },
          }}
        />
      </MaterialTopTabs>
    </View>
  );
}
