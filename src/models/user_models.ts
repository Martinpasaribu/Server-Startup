import mongoose, { Schema, Document } from "mongoose";
// import { ClickUsaha, Nest_Js } from "../config/db_monggo_config";

export interface IUser extends Document {
    _id:string
    googleId: string;
    name: string;
    email: string;
    avatar?: string;
    refreshToken?: string
}

const userSchema = new Schema<IUser>(
  {
      googleId: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
      refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
export default UserModel;