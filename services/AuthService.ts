import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "469869191343-3q7dgv3c0qaf2ptngfgdvanvkbqv18nc.apps.googleusercontent.com";
const appSlug = Constants.expoConfig?.slug;
const username = Constants.expoConfig?.owner;
const REDIRECT_URI = `https://auth.expo.io/@${username}/${appSlug}`
console.log('CLient ID:', CLIENT_ID);
// Generate the Expo Go specific redirect URI
const expoGoRedirectUri = `https://auth.expo.io/@${username}/${appSlug}`;
console.log('Expo Go Redirect URI:', expoGoRedirectUri);

// Also log the standard redirect URI for comparison
const standardRedirectUri = AuthSession.makeRedirectUri({ 
  scheme: 'myapp',
  path: 'auth' 
});
console.log('Standard Redirect URI:', standardRedirectUri);


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
    }
  };

    
  
  export default authService;