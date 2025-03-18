import { Request, Response } from "express";
import { IUser } from "../models/userModel";

// Handle OAuth Success
export const handleOAuthSuccess = (req: Request, res: Response) => {
  res.json({ success: true, user: req.user });
};

// Get User Profile (Session Check)
export const getUserProfile = (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as IUser;

    res.json({
      loggedIn: true,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.json({ loggedIn: false, user: null });
  }
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
