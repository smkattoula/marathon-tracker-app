import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';

const authService = {
    handleGoogleLogin: async () => {
     
      
      try {
        // Use your custom scheme in the redirect URL
  
        const result = await WebBrowser.openAuthSessionAsync(
          `myapp://auth/google`,
          `myapp://auth`
        );
        
        // Check if the authentication was successful
        return { success: result.type === 'success' };
      } catch (error) {
        console.error('Google login failed:', error);
        return { success: false };
      }
    },
    
  };

    
  
  export default authService;