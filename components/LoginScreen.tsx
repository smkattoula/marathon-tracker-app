// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import authService from '../services/AuthService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

interface LoginScreenProps {
    onLoginSuccess?: () => void;
  }
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    console.log('Logging in...');
    setIsLoading(true);
    try {
        const result = await authService.handleGoogleLogin();
        console.log('Login result:', result);
        if (result && result.success) {
          console.log('Login successful');
          navigation.navigate('Home');
          console.log('Login successful');
        }
    } catch (error) {
        console.error('Login failed', error);
    } finally {
        setIsLoading(false);
    }
    
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Please login to continue</Text>
      <Button 
        title={isLoading ? "Logging in..." : "Login with Google"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}