import React from "react";

import * as Form from "~/components/ui/Form";
import { IconSymbol } from "~/components/ui/IconSymbol";

import Stack from "~/components/ui/Stack";
import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import { Image, Switch, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

function Switches() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [on, setOn] = React.useState(colorScheme === "dark");

  return (
    <Form.Section title="Settings">
      <Form.Text
        systemImage={"light.beacon.min"}
        hint={
          <Switch
            value={on}
            onValueChange={() => {
              setOn(!on);
              setColorScheme(on ? "light" : "dark");
            }}
          />
        }
      >
        Dark Mode
      </Form.Text>
      <Form.Link href="/(tabs)/profile/account" systemImage="gear">
        Account
      </Form.Link>
    </Form.Section>
  );
}

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: AC.systemGroupedBackground,
          },
        }}
      />
      <Form.List navigationTitle="My Hub">
        <Form.Section>
          <View style={{ alignItems: "center", gap: 8, padding: 16, flex: 1 }}>
            <Image
              source={{ uri: "https://github.com/1pharaxh.png" }}
              style={{
                aspectRatio: 1,
                height: 64,
                borderRadius: 8,
              }}
            />
            <Form.Text
              style={{
                fontSize: 20,
                fontWeight: "600",
              }}
            >
              Your Name
            </Form.Text>
            <Form.Text style={{ textAlign: "center", fontSize: 14 }}>
              This is my short bio that I wrote about myself. It's not too long,
              but it's not too short either. I think it's just right.
            </Form.Text>
          </View>
        </Form.Section>

        <Form.Section title="About">
          <Form.HStack style={{ alignItems: "stretch", gap: 12 }}>
            <TripleItemTest />
          </Form.HStack>
        </Form.Section>

        <Switches />

        {/* <Form.Section
          title=""
          footer={
            <Text>
              Help improve Search by allowing Apple to store the searches you
              enter into Safari, Siri, and Spotlight in a way that is not linked
              to you.{"\n\n"}Searches include lookups of general knowledge, and
              requests to do things like play music and get directions.{"\n"}
              <Link style={{ color: AC.link }} href="/(tabs)/profile/account">
                About Search & Privacy...
              </Link>
            </Text>
          }
        ></Form.Section> */}

        <Form.Section
          title={
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: AC.label,
                textTransform: "none",
              }}
            >
              Developer
            </Text>
          }
        >
          <Form.Link
            href="https://github.com/1pharaxh"
            target="_blank"
            hintImage={{
              name: "hand.raised.fill",
              color: AC.systemBlue,
              size: 20,
            }}
            style={{ color: AC.systemBlue }}
          >
            Developer Privacy Policy
          </Form.Link>
        </Form.Section>
      </Form.List>
    </SafeAreaView>
  );
}

function TripleItemTest() {
  return (
    <>
      <HorizontalItem title="Expires" badge="88" subtitle="Days" />

      <View
        style={{
          backgroundColor: AC.separator,
          width: 0.5,
          maxHeight: "50%",
          minHeight: "50%",
          marginVertical: "auto",
        }}
      />

      <HorizontalItem
        title="Developer"
        badge={
          <IconSymbol
            name="person.text.rectangle"
            size={28}
            weight="bold"
            animationSpec={{
              effect: {
                type: "pulse",
              },
              repeating: true,
            }}
            color={AC.secondaryLabel}
          />
        }
        subtitle="Akarshan Mishra"
      />

      <View
        style={{
          backgroundColor: AC.separator,
          width: 0.5,
          maxHeight: "50%",
          minHeight: "50%",
          marginVertical: "auto",
        }}
      />

      <HorizontalItem title="Version" badge="3.6" subtitle="Build 250" />
    </>
  );
}

function HorizontalItem({
  title,
  badge,
  subtitle,
}: {
  title: string;
  badge: React.ReactNode;
  subtitle: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
      <Form.Text
        style={{
          textTransform: "uppercase",
          fontSize: 10,
          fontWeight: "600",
          color: AC.secondaryLabel,
        }}
      >
        {title}
      </Form.Text>
      {typeof badge === "string" ? (
        <Form.Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: AC.secondaryLabel,
          }}
        >
          {badge}
        </Form.Text>
      ) : (
        badge
      )}

      <Form.Text
        style={{
          fontSize: 12,
          color: AC.secondaryLabel,
        }}
      >
        {subtitle}
      </Form.Text>
    </View>
  );
}
