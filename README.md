# Marathon Tracker App

A React Native application for tracking marathon activities built with Expo.

## Setup for Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/marathon-tracker-app.git
cd marathon-tracker-app
```

2. Install dependencies
```bash
npm install
cd backend && npm install
cd ..
```

3. Configure environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your credentials
```

4. Update the `.env` file with your own credentials:
```
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:5001

# Google OAuth credentials
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com

# App configuration
EXPO_PUBLIC_APP_BUNDLE_ID=com.yourname.MarathonTrackerApp
```

## Authentication Setup for Testing

### Setting up Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. For iOS:
   - Select "iOS" as the application type
   - Enter your Bundle ID (should match EXPO_PUBLIC_APP_BUNDLE_ID in your .env)
6. For Web:
   - Select "Web application" as the application type
   - Add authorized redirect URIs: `https://auth.expo.io/@your-expo-username/MarathonTrackerApp`
7. Copy the Client IDs to your .env file

### Configuring Your Bundle ID

If you're testing on iOS and don't have access to the original developer account:

1. Use your own Bundle ID in the .env file 
2. When opening the Xcode project, sign with your own development team
3. This will automatically update the Bundle ID prefix

## Starting the App

1. Start the backend server
```bash
cd backend
npm run dev
```

2. In a new terminal, start the Expo development server
```bash
npm start
```

3. Press 'i' to open in iOS simulator or 'a' for Android

## Troubleshooting Authentication

- Make sure your device can reach your development backend server
- Check that Google OAuth credentials are correctly configured
- For iOS, ensure you're using the correct Bundle ID that matches your credentials