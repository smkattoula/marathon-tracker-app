// services/tokenService.ts
import jwt from 'jsonwebtoken';
import {IUser} from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use a strong secret in production
const TOKEN_EXPIRY = "7d"; // Tokens expire in 7 days

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};