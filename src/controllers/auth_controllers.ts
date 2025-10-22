import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "../models/user_models";

dotenv.config();

export const googleCallback: RequestHandler = async (req: any, res: any): Promise<void> => {
  try {
    const user = req.user;
    const redirectCookie = req.cookies.redirect_after_login;

    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    // pastikan user._id ada
    console.log("🔍 User di callback:", user);

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      console.error("❌ JWT_SECRET atau REFRESH_TOKEN_SECRET belum diset");
      res.status(500).json({ message: "Server misconfiguration" });
      return;
    }

    // 🎟️ Access Token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 🔄 Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // 🔒 Simpan refresh token ke DB
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { refreshToken: refreshToken },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error("⚠️ Gagal update refreshToken untuk user:", user._id);
    } else {
      console.log("✅ Refresh token disimpan di DB:", updatedUser.email);
    }

res.cookie("refreshToken", refreshToken, {
       httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 10 * 60 * 1000, // 5 menit
});

res.cookie("accessToken", accessToken, {
       httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 5 * 60 * 1000, // 5 menit
});




    // 🌍 Redirect ke FE
    const frontendUrl = process.env.FRONTEND_URL || "https://www.clickusaha.com";
    const redirectTo = redirectCookie ? redirectCookie : `${frontendUrl}/`;
    // res.clearCookie("redirect_after_login");

    const redirectURL = `${frontendUrl}/en/auth/success?redirect=${encodeURIComponent(redirectTo)}`;
    console.log("✅ Redirect ke FE:", redirectURL);
    setTimeout(() => {
     res.redirect(redirectURL);
}, 1000);
  } catch (error) {
    console.error("❌ Error di googleCallback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getMe: RequestHandler = async (req: any, res, next):  Promise<void> => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId).select("-refreshToken");
    if (!user) {
      res.status(404).json({ message: "User not found" });

    return;
    }
      

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });

  } catch (err) {
    next(err); // kirim ke error handler
  }
};

export const Logout: RequestHandler = async (req: any, res, next):  Promise<void> => {

  try {
    
    const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {

    res.status(204).json({ message: "Tidak ada token" });
    
    return ;
  } 

  const user = await UserModel.findOne({ refreshToken });

  if (!user) {

    res.status(204).json({ message: "Token tidak ditemukan" });
    return ;

  } 

  user.refreshToken = "";
  await user.save();

  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "none", secure: true });
  res.status(200).json({ message: "Logout berhasil" });

  } catch (err) {
     next(err); // kirim ke error handler
  }
};
