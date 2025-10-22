"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nest_Js = exports.ClickUsaha = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI1 = process.env.MongoDB_cloud_1 || "";
const mongoUser1 = process.env.MongoDB_user_1 || "";
const mongoPass1 = process.env.MongoDB_pass_1 || "";
const mongoURI2 = process.env.MongoDB_cloud_2 || "";
const mongoUser2 = process.env.MongoDB_user_2 || "";
const mongoPass2 = process.env.MongoDB_pass_2 || "";
if (!mongoURI1 || !mongoURI2) {
    throw new Error("MongoDB URI tidak ditemukan di environment variables.");
}
// 🔹 Koneksi ke DB pertama
exports.ClickUsaha = mongoose_1.default.createConnection(mongoURI1, {
    user: mongoUser1,
    pass: mongoPass1,
    dbName: "ClickUsaha", // optional kalau URI sudah include nama db
});
exports.ClickUsaha.on("error", (err) => console.error("Error koneksi DB1:", err));
exports.ClickUsaha.once("open", () => console.log("✅ Koneksi DB1 berhasil terbuka"));
// 🔹 Koneksi ke DB kedua
exports.Nest_Js = mongoose_1.default.createConnection(mongoURI2, {
    user: mongoUser2,
    pass: mongoPass2,
    dbName: "Nest_Js",
});
exports.Nest_Js.on("error", (err) => console.error("Error koneksi DB2:", err));
exports.Nest_Js.once("open", () => console.log("✅ Koneksi DB2 berhasil terbuka"));
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// // Memuat variabel lingkungan dari file .env
// dotenv.config();
// // URI MongoDB dari environment variable
// const mongoURI: string = process.env.MongoDB_cloud || "";
// const mongoUser: string = process.env.MongoDB_user || "";
// const mongoPass: string = process.env.MongoDB_pass || "";
// // console.log(" Env : ", process.env.MongoDB_cloud);
// if (!mongoURI) {
//   throw new Error("MongoDB URI tidak ditemukan di environment variables.");
// }
// // Fungsi untuk menginisialisasi koneksi
// export const connectToMongoDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect(mongoURI, {
//         user: mongoUser,
//         pass: mongoPass,
//     });
//     console.log("MongoDB berhasil terhubung.");
//   } catch (error) {
//     console.error("Gagal terhubung ke MongoDB:", error);
//     process.exit(1); // Keluar dengan kode error
//   }
// };
// // Event handler untuk koneksi
// const db = mongoose.connection;
// db.on("error", (err) => {
//   console.error("Error pada koneksi MongoDB:", err);
// });
// db.once("open", () => {
//   console.log("Koneksi ke MongoDB telah terbuka.");
// });
// export default db;
