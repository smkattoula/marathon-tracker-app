import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { MenuIcon } from "@/components/ui/icon";
import { NativeStackNavigationProp} from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export default function HomeScreen() {

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [menuOpen, setMenuOpen] = React.useState(false);

  
    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
    
    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("userToken");
        await axios.get(`${API_URL}/auth/logout`, {
          withCredentials: true,
        });
        router.replace("/login");
        console.log("Logout successful!");
      } catch (error) {
        console.error("Logout failed:", error);
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
          >
            <MenuItemLabel size="sm">Profile</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Settings" textValue="Settings" className="p-2">
            <MenuItemLabel size="sm">Settings</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Logout" textValue="Logout" className="p-2" onPress = {handleLogout}>
            <MenuItemLabel size="sm">Logout</MenuItemLabel>
          </MenuItem>
        </Menu>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text size="2xl" bold={true}>
          Welcome to Marathon Tracker App!
        </Text>
        <Text size="sm"> By Dusk Digital</Text>
      </View>
    </View>
  );
}
