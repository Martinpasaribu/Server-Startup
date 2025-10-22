import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyRefreshToken: RequestHandler = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token tidak ditemukan" });
    return; // pastikan hanya return, bukan return res.status()
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    (req as any).user = decoded;
    next(); // lanjut ke handler berikutnya
  } catch (error) {
    res.status(403).json({ message: "Refresh token tidak valid" });
  }
};
