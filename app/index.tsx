import { View,  } from "react-native";
import React from "react";
import LoginScreen from "@/components/LoginScreen";
import HomeScreen from "@/components/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";


export default function Index() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
      </Stack.Navigator>
    </>
  );
}
