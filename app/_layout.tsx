import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: "Home",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
