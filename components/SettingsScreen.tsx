import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Switch } from "@/components/ui/switch";
import { ThemeContext } from "@/app/_layout";
import ThemeAwareScreen from "@/components/ui/theme-aware-screen";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <ThemeAwareScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Heading size="xl" style={styles.headerText}>
              Settings
            </Heading>

            <Divider style={styles.divider} />

            <VStack space="lg">
              <Heading size="md">Appearance</Heading>

              <HStack space="md" style={styles.settingRow}>
                <Text size="md">Dark Mode</Text>
                <Switch
                  size="md"
                  isChecked={theme === "dark"}
                  onToggle={toggleTheme}
                  trackColor={{
                    false: "#767577",
                    true: "#81b0ff",
                  }}
                />
              </HStack>

              <Divider style={styles.divider} />

              <Heading size="md">Units</Heading>

              <HStack space="md" style={styles.settingRow}>
                <Text size="md">Use Kilometers</Text>
                <Switch
                  size="md"
                  isChecked={true}
                  onToggle={() => {
                    // This would be implemented when you add unit preferences
                    console.log("Unit preference toggled");
                  }}
                  trackColor={{
                    false: "#767577",
                    true: "#81b0ff",
                  }}
                />
              </HStack>

              <Divider style={styles.divider} />

              <Heading size="md">About</Heading>
              <Text size="sm" style={styles.version}>
                Version 1.0.0
              </Text>
            </VStack>
          </Card>
        </View>
      </ScrollView>
    </ThemeAwareScreen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    padding: 16,
  },
  headerText: {
    textAlign: "center",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  settingRow: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  version: {
    opacity: 0.6,
    textAlign: "center",
    marginTop: 8,
  },
});
