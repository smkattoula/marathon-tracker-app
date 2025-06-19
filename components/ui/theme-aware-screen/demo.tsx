import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import ThemeAwareScreen from "@/components/ui/theme-aware-screen";
import { ThemeContext } from "@/app/_layout";

export default function LoginScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeAwareScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Heading size="xl" style={styles.headerText}>
            Login Screen
          </Heading>
          <Text>This will be updated with login controls</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    textAlign: "center",
    marginBottom: 16,
  },
});
