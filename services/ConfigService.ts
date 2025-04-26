import Constants from 'expo-constants';

/**
 * A service for centralized config management
 * Makes it easier to share the app with others for testing
 */
const ConfigService = {
  /**
   * API and backend configuration
   */
  api: {
    backendUrl: process.env.REACT_APP_BACKEND_URL || "http://localhost:5001",
  },

  /**
   * Authentication configuration
   */
  auth: {
    /**
     * Google OAuth configuration
     */
    google: {
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "469869191343-3q7dgv3c0qaf2ptngfgdvanvkbqv18nc.apps.googleusercontent.com",
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "469869191343-cr2flp6klveh6n0sphn4b3craf1os4t8.apps.googleusercontent.com",
      redirectUri: `https://auth.expo.io/@${Constants.expoConfig?.owner || 'unknown'}/${Constants.expoConfig?.slug || 'unknown'}`,
    },
  },

  /**
   * Application configuration
   */
  app: {
    bundleId: process.env.EXPO_PUBLIC_APP_BUNDLE_ID || "com.condor94.MarathonTrackerApp",
    owner: Constants.expoConfig?.owner || 'unknown',
    appSlug: Constants.expoConfig?.slug || 'unknown',
  },

  /**
   * Helper method to get a complete auth configuration
   */
  getAuthConfig() {
    return {
      google: this.auth.google
    };
  }
};

export default ConfigService;