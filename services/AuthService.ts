import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "469869191343-3q7dgv3c0qaf2ptngfgdvanvkbqv18nc.apps.googleusercontent.com";
const appSlug = Constants.expoConfig?.slug;
const username = Constants.expoConfig?.owner;
const REDIRECT_URI = `https://auth.expo.io/@${username}/${appSlug}`

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let authInstance = null;
const authService = {

    initGoogle: () => {
      WebBrowser.maybeCompleteAuthSession();
    },

    handleGoogleLogin: async () => {
     
      
      try {
        const discovery = await AuthSession.fetchDiscoveryAsync(
          'https://accounts.google.com'
        );

        const request = new AuthSession.AuthRequest({
          clientId: CLIENT_ID,
          scopes: ['profile', 'email'],
          redirectUri: REDIRECT_URI,
          responseType: AuthSession.ResponseType.Code,
        });
        
        authInstance = request;
        const result = await request.promptAsync(discovery);
        console.log('Google login result:', result);

        if (result.type === 'success') {
          return { success: true};
        }

        return { success: false };
      } catch (error) {
        console.error('Google login failed:', error);
        return { success: false };
      }
    },
    logout: async () => {
      try {
        authInstance = null;
        return { success: true };
      } catch (error) {
        console.error('Logout failed:', error);
        return { success: false };
      }
    },

    // Add check auth method
    checkAuthStatus: async () => {
      try {
        // Get token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token from AsyncStorage:', token ? 'Found' : 'Not found');
        
        if (!token) {
          return { isAuthenticated: false, user: null };
        }
        
        // Set up request config
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        // Make API request with its own error handling
        try {
          const response = await api.get('/auth/me', config);
          console.log('/auth/me response:', JSON.stringify(response.data));
          
          if (response.data.loggedIn) {
            return {
              isAuthenticated: true,
              user: response.data.user,
            };
          } else {
            await AsyncStorage.removeItem('userToken');
            return { isAuthenticated: false, user: null };
          }
        } catch (error) {
          // This is specifically for API request errors
          console.error('API request failed:', error);
          throw error; // Re-throw to be caught by outer catch
        }
      } catch (error) {
        // This catches any error in the whole function
        console.error('Auth check failed:', error);
        await AsyncStorage.removeItem('userToken');
        return { isAuthenticated: false, user: null };
      }
    }
};

    
  
export default authService;