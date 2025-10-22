"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth_routes.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const auth_controllers_1 = require("../controllers/auth_controllers");
const verifyRefreshToken_1 = require("../middlewares/verifyRefreshToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = require("../middlewares/verifyToken");
const AuthRoute = (0, express_1.Router)();
// 🔹 1. Arahkan user ke Google untuk login
// 🔹 arahkan user ke Google untuk login, sambil simpan redirect dari FE
AuthRoute.get("/google", (req, res, next) => {
    const redirect = req.query.redirect;
    if (redirect) {
        res.cookie("redirect_after_login", redirect, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 5 * 60 * 1000, // 5 menit
        });
    }
    next();
}, passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
}));
// 🔹 callback setelah login sukses
AuthRoute.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), auth_controllers_1.googleCallback);
AuthRoute.post("/refresh", verifyRefreshToken_1.verifyRefreshToken, (req, res) => {
    const user = req.user;
    const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.status(200).json({
        accessToken: newAccessToken,
    });
});
AuthRoute.get("/me", verifyToken_1.verifyToken, auth_controllers_1.getMe);
AuthRoute.post("/logout", auth_controllers_1.Logout);
exports.default = AuthRoute;
