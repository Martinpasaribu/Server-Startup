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
exports.connectToMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// // Pastikan Mongoose tidak memunculkan warning strict query
// mongoose.set("strictQuery", true);
// // Load environment variables
// const mongoURI1 = process.env.MongoDB_cloud_1 || "";
// const mongoUser1 = process.env.MongoDB_user_1 || "";
// const mongoPass1 = process.env.MongoDB_pass_1 || "";
// const mongoURI2 = process.env.MongoDB_cloud_2 || "";
// const mongoUser2 = process.env.MongoDB_user_2 || "";
// const mongoPass2 = process.env.MongoDB_pass_2 || "";
// if (!mongoURI1 || !mongoURI2) {
//   throw new Error("❌ MongoDB URI tidak ditemukan di environment variables.");
// }
// // 🧠 Gunakan global cache untuk mencegah multiple connection (Vercel cold start)
// let cachedConnections: {
//   ClickUsaha?: mongoose.Connection;
//   Nest_Js?: mongoose.Connection;
// } = (global as any).mongooseConnections || {};
// if (!cachedConnections.ClickUsaha) {
//   cachedConnections.ClickUsaha = mongoose.createConnection(mongoURI1, {
//     user: mongoUser1,
//     pass: mongoPass1,
//     dbName: "ClickUsaha",
//     bufferCommands: false, // supaya error cepat muncul kalau belum ready
//   });
//   cachedConnections.ClickUsaha.on("open", () =>
//     console.log("✅ Koneksi DB1 (ClickUsaha) berhasil terbuka")
//   );
//   cachedConnections.ClickUsaha.on("error", (err) =>
//     console.error("❌ Error koneksi DB1:", err)
//   );
// }
// if (!cachedConnections.Nest_Js) {
//   cachedConnections.Nest_Js = mongoose.createConnection(mongoURI2, {
//     user: mongoUser2,
//     pass: mongoPass2,
//     dbName: "Nest_Js",
//     bufferCommands: false,
//   });
//   cachedConnections.Nest_Js.on("open", () =>
//     console.log("✅ Koneksi DB2 (Nest_Js) berhasil terbuka")
//   );
//   cachedConnections.Nest_Js.on("error", (err) =>
//     console.error("❌ Error koneksi DB2:", err)
//   );
// }
// // Simpan di global agar tidak re-init setiap kali function dieksekusi (misalnya di Vercel)
// (global as any).mongooseConnections = cachedConnections;
// // Export koneksi agar bisa digunakan di model-model
// export const ClickUsaha = cachedConnections.ClickUsaha!;
// export const Nest_Js = cachedConnections.Nest_Js!;
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// // Memuat variabel lingkungan dari file .env
// dotenv.config();
// URI MongoDB dari environment variable
const mongoURI = process.env.MongoDB_cloud || "";
const mongoUser = process.env.MongoDB_user || "";
const mongoPass = process.env.MongoDB_pass || "";
// console.log(" Env : ", process.env.MongoDB_cloud);
if (!mongoURI) {
    throw new Error("MongoDB URI tidak ditemukan di environment variables.");
}
// Fungsi untuk menginisialisasi koneksi
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(mongoURI, {
            user: mongoUser,
            pass: mongoPass,
        });
        console.log("MongoDB berhasil terhubung.");
    }
    catch (error) {
        console.error("Gagal terhubung ke MongoDB:", error);
        process.exit(1); // Keluar dengan kode error
    }
});
exports.connectToMongoDB = connectToMongoDB;
// Event handler untuk koneksi
const db = mongoose_1.default.connection;
db.on("error", (err) => {
    console.error("Error pada koneksi MongoDB:", err);
});
db.once("open", () => {
    console.log("Koneksi ke MongoDB telah terbuka.");
});
exports.default = db;
