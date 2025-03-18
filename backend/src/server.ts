import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import connectDB from "./config/db";

const app = express();

// Middleware
app.use(
  cors({ origin: process.env.FRONTEND_URL as string, credentials: true })
);
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Change to `true` in production with HTTPS
      httpOnly: true, // Prevent XSS attacks
      sameSite: "lax", // Allow frontend requests
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
