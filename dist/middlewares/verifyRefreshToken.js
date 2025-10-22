"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyRefreshToken = (req, res, next) => {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token tidak ditemukan" });
        return; // pastikan hanya return, bukan return res.status()
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decoded;
        next(); // lanjut ke handler berikutnya
    }
    catch (error) {
        res.status(403).json({ message: "Refresh token tidak valid" });
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
