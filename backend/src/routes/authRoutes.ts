import express from "express";
import passport from "passport";
import {
  getUserProfile,
  logoutUser,
  handleOAuthSuccess,
} from "../controllers/authController";

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
  handleOAuthSuccess
);

// Get Logged-in User Profile
router.get("/me", getUserProfile);

// Logout User
router.get("/logout", logoutUser);

export default router;
