import express from "express";
import passport from "passport";
import {
  getUserProfile,
  logoutUser,
  handleOAuthSuccess,
  exchangeGoogleToken,
} from "../controllers/authController";

const API_URL = 'http://localhost:5001';
const router = express.Router();

// Login Route (Redirect to Google OAuth)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  // handleOAuthSuccess
  handleOAuthSuccess
);

// Get Logged-in User Profile
router.get("/me", getUserProfile);

// Logout User
router.get("/logout", logoutUser);

router.post('/google-token-exchange', exchangeGoogleToken);

export default router;
