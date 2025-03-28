import { Request, Response } from "express";
import User from "../models/userModel";
import { findOrCreateGoogleUser, GoogleUserData } from "../services/userService";
import { generateToken, verifyToken } from "../services/tokenService";
import axios from "axios";


// Interface for potential decoded token payload
interface TokenPayload {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

// Handle OAuth Success
export const handleOAuthSuccess = (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
  res.redirect('myapp://auth')
  console.log("handleOAuthSuccess called");
};

// Handle Google Token Exchange
export const exchangeGoogleToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'No token provided' });
      return;
    }
    // Need to verify Google token in the future
    // For now, just generate a simple token
    // In the future we should verify with Google API
    const appToken  = `app-token-${Date.now()}`;

    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    )
    if (googleResponse.data) {
      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const googleUserData = userInfoResponse.data;
      console.log('Google User Info:', googleUserData);

      const user = await findOrCreateGoogleUser(googleUserData)
      const appToken = generateToken(user);
      res.json({token: appToken,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          picture: user.picture,
        }
      });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      res.status(500).json({ error: 'Failed to exchange token' });
    }
  };


  

// Get User Profile (Session Check)
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  // Check for session-based auth first
  if (req.user) {
    const user = req.user as any;
    res.json({
      loggedIn: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture
      },
    });
    return;
  }
  
  // Check for token-based auth
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const payload = verifyToken(token);
    
    if (payload) {
      try {
        // Find user by ID
        const user = await User.findById(payload.userId);
        
        if (user) {
          res.json({
            loggedIn: true,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              picture: user.picture
            },
          });
          return;
        }
      } catch (error) {
        console.error('Error finding user:', error);
      }
    }
  }
  
  // No valid auth found
  res.json({ loggedIn: false, user: null });
};

// Logout User
export const logoutUser = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ loggedOut: true });
    });
  });
};
