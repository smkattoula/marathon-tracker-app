// screens/LoginScreen.js
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import authService from '../services/AuthService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
    onLoginSuccess?: () => void;
  }
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const [userInfo, setUserInfo] = useState(null);
  const WEB_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "469869191343-3q7dgv3c0qaf2ptngfgdvanvkbqv18nc.apps.googleusercontent.com";
  const IOS_CLIENT_ID = process.env.GOOGLE_CLIENT_ID_IOS || "469869191343-cr2flp6klveh6n0sphn4b3craf1os4t8.apps.googleusercontent.com";
  const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
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
              router.replace("/home");
            }
          } catch (error) {
            console.error('Error exchanging token:', error);
          }
        };
        exchangeToken();
      }
  }, [response]);

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