// src/middleware/verifyToken.ts
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken: RequestHandler = (req, res, next) => {
  let token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.split(" ")[1] ?? null);

  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token tidak ditemukan" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    console.warn("⚠️ Access token kadaluarsa, coba refresh...");

    // Jika token kadaluarsa → cek refresh token
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(403).json({ message: "Forbidden: Tidak ada refresh token" });
      return;
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as any;

      // Buat access token baru
      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );

      // Set cookie baru
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      (req as any).user = decodedRefresh;
      next();
    } catch (refreshError) {
      console.error("❌ Refresh token invalid:", refreshError);
      res.status(403).json({ message: "Forbidden: Refresh token tidak valid" });
    }
  }
};
