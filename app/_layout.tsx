import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModeType } from "@/components/ui/gluestack-ui-provider/types";

// Create a context for theme that can be used throughout the app
import { createContext } from "react";
export const ThemeContext = createContext({
  theme: "light" as ModeType,
  toggleTheme: () => {},
});

export default function RootLayout() {
  const [theme, setTheme] = useState<ModeType>("light");

  // Load theme from AsyncStorage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userTheme");
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadTheme();
  }, []);

  // Toggle theme function to be used in Settings
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("userTheme", newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GluestackUIProvider mode={theme}>
        <Stack
          screenOptions={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: theme === "dark" ? "#181818" : "#FFFFFF",
            },
            headerTintColor: theme === "dark" ? "#FFFFFF" : "#000000",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="home" />
          <Stack.Screen
            name="profile"
            options={{
              title: "User Profile",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Settings",
              headerTitleAlign: "center",
            }}
          />
        </Stack>
      </GluestackUIProvider>
    </ThemeContext.Provider>
  );
}
