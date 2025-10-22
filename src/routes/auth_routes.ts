// src/routes/auth_routes.ts
import { Router } from "express";
import passport from "../config/passport";
import { getMe, googleCallback, Logout } from "../controllers/auth_controllers";
import { verifyRefreshToken } from "../middlewares/verifyRefreshToken";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/verifyToken";
import UserModel from "../models/user_models";

const AuthRoute = Router();

// 🔹 1. Arahkan user ke Google untuk login
// 🔹 arahkan user ke Google untuk login, sambil simpan redirect dari FE
AuthRoute.get(
  "/google",
  (req, res, next) => {
    const redirect = req.query.redirect as string;
    if (redirect) {
      res.cookie("redirect_after_login", redirect, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60 * 1000, // 5 menit
      });
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

// 🔹 callback setelah login sukses
AuthRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

AuthRoute.post("/refresh", verifyRefreshToken, (req, res) => {
  const user = (req as any).user;

  const newAccessToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  res.status(200).json({
    accessToken: newAccessToken,
  });
});

AuthRoute.get("/me", verifyToken, getMe);


AuthRoute.post("/logout", Logout)


export default AuthRoute;
