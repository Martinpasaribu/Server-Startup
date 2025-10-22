"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (req, res, next) => {
    var _a, _b, _c, _d;
    let token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_c = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]) !== null && _c !== void 0 ? _c : null);
    if (!token) {
        res.status(401).json({ message: "Unauthorized: Token tidak ditemukan" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.warn("⚠️ Access token kadaluarsa, coba refresh...");
        // Jika token kadaluarsa → cek refresh token
        const refreshToken = (_d = req.cookies) === null || _d === void 0 ? void 0 : _d.refreshToken;
        if (!refreshToken) {
            res.status(403).json({ message: "Forbidden: Tidak ada refresh token" });
            return;
        }
        try {
            const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            // Buat access token baru
            const newAccessToken = jsonwebtoken_1.default.sign({ id: decodedRefresh.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
            // Set cookie baru
            res.cookie("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
                maxAge: 15 * 60 * 1000,
            });
            req.user = decodedRefresh;
            next();
        }
        catch (refreshError) {
            console.error("❌ Refresh token invalid:", refreshError);
            res.status(403).json({ message: "Forbidden: Refresh token tidak valid" });
        }
    }
};
exports.verifyToken = verifyToken;
