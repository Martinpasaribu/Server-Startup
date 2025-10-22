"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.getMe = exports.googleCallback = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_models_1 = __importDefault(require("../models/user_models"));
dotenv_1.default.config();
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
        // 🔄 Refresh Token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        // 🔒 Simpan refresh token ke DB
        const updatedUser = yield user_models_1.default.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(user._id) }, { refreshToken: refreshToken }, { new: true, runValidators: true });
        if (!updatedUser) {
            console.error("⚠️ Gagal update refreshToken untuk user:", user._id);
        }
        else {
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
    }
    catch (error) {
        console.error("❌ Error di googleCallback:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.googleCallback = googleCallback;
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield user_models_1.default.findById(userId).select("-refreshToken");
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
    }
    catch (err) {
        next(err); // kirim ke error handler
    }
});
exports.getMe = getMe;
const Logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(204).json({ message: "Tidak ada token" });
            return;
        }
        const user = yield user_models_1.default.findOne({ refreshToken });
        if (!user) {
            res.status(204).json({ message: "Token tidak ditemukan" });
            return;
        }
        user.refreshToken = "";
        yield user.save();
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
        res.clearCookie("accessToken", { httpOnly: true, sameSite: "none", secure: true });
        res.status(200).json({ message: "Logout berhasil" });
    }
    catch (err) {
        next(err); // kirim ke error handler
    }
});
exports.Logout = Logout;
