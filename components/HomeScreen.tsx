import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { MenuIcon } from "@/components/ui/icon";
import axios from "axios";
import {router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfigService from "@/services/ConfigService";

interface HomeScreenProps {
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  } | null;
}

export default function HomeScreen({ user }: HomeScreenProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const API_URL = ConfigService.api.backendUrl;
    
  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      await AsyncStorage.removeItem("userToken");
      // setUser(null) right here??

      router.replace("/login");
      console.log("Logout successful!");
    } catch (error) {
      // Even if the backend call fails, we should still clear local storage and redirect
      // This ensures the user can still "log out" on the frontend
      console.error("Logout failed:", error);
      await AsyncStorage.removeItem("userToken");
      router.replace("/login");
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1000,
        }}
      >
        <Menu
          placement="bottom right"
          offset={5}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          trigger={({ ...triggerProps }) => {
            return (
              <Button
                {...triggerProps}
                size="md"
                onPress={() => setMenuOpen((prev) => !prev)}
              >
                <ButtonIcon as={MenuIcon} />
              </Button>
            );
          }}
        >
          <MenuItem
            key="Profile"
            textValue="Profile"
            className="p-2 justify-between"
            onPress={() => router.push('/profile')}
          >
            <MenuItemLabel size="sm">Profile</MenuItemLabel>
          </MenuItem>
          <MenuItem
            key="Workouts"
            textValue="Workouts"
            className="p-2 justify-between"
            onPress={() => router.push('/workouts')}
          >
            <MenuItemLabel size="sm">Workouts</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Settings" textValue="Settings" className="p-2">
            <MenuItemLabel size="sm">Settings</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Logout" textValue="Logout" className="p-2" onPress={handleLogout}>
            <MenuItemLabel size="sm">Logout</MenuItemLabel>
          </MenuItem>
        </Menu>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text size="2xl" bold={true}>
          Welcome to Marathon Tracker App!
        </Text>
        {user && (
          <Text size="lg" style={{ marginTop: 10 }}>
            Hello, {user.name}!
          </Text>
        )}
        <Button 
          size="lg" 
          style={{ marginTop: 30 }}
          onPress={() => router.push('/workouts')}
        >
          <ButtonText>View Running History</ButtonText>
        </Button>
        <Text size="sm" style={{ marginTop: 20 }}> By Dusk Digital</Text>
      </View>
    </View>
  );
}