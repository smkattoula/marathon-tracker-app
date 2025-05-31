# Theme-Aware Components

This directory contains components that automatically adapt their appearance based on the current theme setting (light/dark mode).

## ThemeAwareScreen

`ThemeAwareScreen` is a wrapper component that provides a theme-aware background for your screens. It automatically adjusts the background color based on the current theme.

### Usage

```tsx
import ThemeAwareScreen from "@/components/ui/theme-aware-screen";

export default function MyScreen() {
  return <ThemeAwareScreen>{/* Your screen content */}</ThemeAwareScreen>;
}
```

### Props

- `children`: React nodes to render within the screen
- `style`: Additional styles to apply to the container (ViewStyle)
- `lightBackgroundColor`: Custom background color for light mode (default: "#FFFFFF")
- `darkBackgroundColor`: Custom background color for dark mode (default: "#181818")

## Theme Context

The app uses a ThemeContext to manage the theme state. You can access the current theme and toggle function using:

```tsx
import { useContext } from "react";
import { ThemeContext } from "@/app/_layout";

function MyComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Use theme (will be 'light' or 'dark')
  // Call toggleTheme() to switch between themes
}
```

## Header Theming

Headers are automatically themed in the `_layout.tsx` file using the Stack screenOptions:

```tsx
<Stack
  screenOptions={{
    headerStyle: {
      backgroundColor: theme === "dark" ? "#181818" : "#FFFFFF",
    },
    headerTintColor: theme === "dark" ? "#FFFFFF" : "#000000",
  }}
>
```
