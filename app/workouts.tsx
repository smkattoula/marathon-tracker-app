import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import WorkoutScreen from '@/components/WorkoutScreen';
import { router } from 'expo-router';
import authService from '@/services/AuthService';

export default function Workouts() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated, user } = await authService.checkAuthStatus();

      if (!isAuthenticated) {
        console.log("User is not authenticated");
        router.replace("/login");
        return;
      }

      setUser(user);
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
      
  return <WorkoutScreen />;
}