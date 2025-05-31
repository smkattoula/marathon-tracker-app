import React, { useContext } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { ThemeContext } from "@/app/_layout";

type ThemeAwareScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
};

export default function ThemeAwareScreen({
  children,
  style,
  lightBackgroundColor = "#FFFFFF",
  darkBackgroundColor = "#181818",
}: ThemeAwareScreenProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme === "dark" ? darkBackgroundColor : lightBackgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
