import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id:mongoose.Schema.Types.ObjectId;
  googleId: string;
  name: string;
  email: string;
  picture?: string;
  locale?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    locale: { type: String },
    lastLogin: { type: Date, default: Date.now },
    
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
