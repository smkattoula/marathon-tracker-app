import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import LoginSheet from "@/components/LoginSheet";
import RegisterSheet from "@/components/RegisterSheet";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { MenuIcon } from "@/components/ui/icon";

export default function Index() {
  const [showLoginSheet, setShowLoginSheet] = React.useState(false);
  const [showRegisterSheet, setShowRegisterSheet] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

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
          <MenuItem key="Logout" textValue="Logout" className="p-2">
            <MenuItemLabel size="sm">Logout</MenuItemLabel>
          </MenuItem>
        </Menu>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text size="2xl" bold={true}>
          Welcome to Marathon Tracker App!
        </Text>
        <Text size="sm"> By Dusk Digital</Text>

        <HStack space="lg" style={{ marginTop: 20 }}>
          <Button
            onPress={() => setShowLoginSheet(true)}
            size="lg"
            variant="solid"
          >
            <ButtonText>Sign In</ButtonText>
          </Button>

          <Button
            onPress={() => setShowRegisterSheet(true)}
            size="lg"
            variant="solid"
          >
            <ButtonText>Register</ButtonText>
          </Button>
        </HStack>
        {/* Actionsheet for Sign in  */}
        <LoginSheet
          isOpen={showLoginSheet}
          onClose={() => setShowLoginSheet(false)}
        />

        {/* Actionsheet for Register */}
        <RegisterSheet
          isOpen={showRegisterSheet}
          onClose={() => setShowRegisterSheet(false)}
        />
      </View>
    </View>
  );
}
