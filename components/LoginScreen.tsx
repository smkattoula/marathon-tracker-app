// screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import authService from '../services/AuthService';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ConfigService from '../services/ConfigService';

WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
    onLoginSuccess?: () => void;
  }

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  
  // Use ConfigService to get our configuration values
  const WEB_CLIENT_ID = ConfigService.auth.google.webClientId;
  const IOS_CLIENT_ID = ConfigService.auth.google.iosClientId;
  const API_URL = ConfigService.api.backendUrl;
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
  });

  useEffect(() => {
      if (response?.type === 'success') {
        setIsLoading(false);
        console.log('Login successful!');
        console.log('API URL:', `${API_URL}/auth/google-token-exchange`);
        // Get google token
        const googleToken = response.authentication?.accessToken;

        const exchangeToken = async () => {
          try {
            const backendResponse = await axios.post(`${API_URL}/auth/google-token-exchange`, {
              token: googleToken
            });
        
            if (backendResponse.data.token) {
              await AsyncStorage.setItem('userToken', backendResponse.data.token);
              console.log('Token saved to AsyncStorage:', backendResponse.data.token);
              //navigate to home
              if (onLoginSuccess) {
                onLoginSuccess();
              } 
              // Force an explicit navigation to home instead of replace
              router.navigate("/home");
            }
          } catch (error) {
            console.error('Error exchanging token:', error);
            // Handle error state properly
            setIsLoading(false);
          }
        };
        exchangeToken();
      }
  }, [response, API_URL, onLoginSuccess]);

  const handleLogin = async () => {
    console.log('Attempting Google login:');
    setIsLoading(true);
    try {
        await promptAsync();
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
        disabled={isLoading || !request}
      />
    </View>
  );
}