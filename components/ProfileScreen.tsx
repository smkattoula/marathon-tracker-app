import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import ThemeAwareScreen from "@/components/ui/theme-aware-screen";
import authService from "@/services/AuthService";

interface ProfileScreenProps {
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    bio?: string;
  } | null;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update bio state when user changes
  useEffect(() => {
    if (user?.bio !== undefined) {
      setBio(user.bio);
    }
  }, [user]);

  if (!user) {
    return (
      <ThemeAwareScreen>
        <View style={styles.container}>
          <Text size="xl" bold={true}>
            User not found or not logged in
          </Text>
          <Button size="md" onPress={() => router.replace("/login")}>
            <ButtonText>Go to Login</ButtonText>
          </Button>
        </View>
      </ThemeAwareScreen>
    );
  }

  const handleSaveBio = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const result = await authService.updateUserProfile({ bio } as any);

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error("Failed to save bio:", result.error);
      }
    } catch (error) {
      console.error("Failed to save bio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeAwareScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Heading>
              <Text size="2xl" bold={true} style={styles.headerText}>
                Profile
              </Text>
            </Heading>

            <VStack space="md">
              {user.picture ? (
                <Image
                  source={{ uri: user.picture }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text size="2xl">{user.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}

              <Text size="xl" bold={true}>
                {user.name}
              </Text>

              <Divider />

              <VStack space="sm" style={styles.infoContainer}>
                <HStack space="sm">
                  <Text size="md" bold={true}>
                    Email:
                  </Text>
                  <Text size="md">{user.email}</Text>
                </HStack>
              </VStack>
            </VStack>

            <Divider />
            <VStack space="sm">
              <Text size="md" bold={true}>
                Bio
              </Text>
              <Textarea
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={isSaving}
                className="w-64"
              >
                <TextareaInput
                  placeholder="About me..."
                  value={bio}
                  onChangeText={setBio}
                />
              </Textarea>

              <HStack space="md" style={styles.saveContainer}>
                {saveSuccess && (
                  <Text size="sm" style={styles.successText}>
                    Bio saved successfully!
                  </Text>
                )}
                <Button
                  size="sm"
                  onPress={handleSaveBio}
                  isDisabled={isSaving}
                  style={styles.saveButton}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <ButtonText>Save Bio</ButtonText>
                  )}
                </Button>
              </HStack>
            </VStack>

            <Divider style={{ marginVertical: 16 }} />

            <Button
              size="md"
              variant="outline"
              onPress={() => router.push("/settings")}
            >
              <ButtonText>Settings</ButtonText>
            </Button>
          </Card>
        </View>
      </ScrollView>
    </ThemeAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
  headerText: {
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContainer: {
    width: "100%",
    padding: 8,
  },
  userId: {
    fontSize: 14,
    opacity: 0.7,
    maxWidth: 200,
  },
  saveContainer: {
    marginTop: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  saveButton: {
    minWidth: 100,
  },
  successText: {
    color: "green",
  },
  backButtonContainer: {
    marginTop: 20,
  },
});
