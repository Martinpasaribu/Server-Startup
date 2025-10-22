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
// // 
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// const mongoURI1: string = process.env.MongoDB_cloud_1 || "";
// const mongoUser1: string = process.env.MongoDB_user_1 || "";
// const mongoPass1: string = process.env.MongoDB_pass_1 || "";
// const mongoURI2: string = process.env.MongoDB_cloud_2 || "";
// const mongoUser2: string = process.env.MongoDB_user_2 || "";
// const mongoPass2: string = process.env.MongoDB_pass_2 || "";
// if (!mongoURI1 || !mongoURI2) {
//   throw new Error("MongoDB URI tidak ditemukan di environment variables.");
// }
// // 🔹 Koneksi ke DB pertama
// mongoose.set("strictQuery", true);
// export const ClickUsaha = mongoose.createConnection(mongoURI1, {
//   user: mongoUser1,
//   pass: mongoPass1,
//   dbName: "ClickUsaha",
//   bufferCommands: false,
// });
// export const Nest_Js = mongoose.createConnection(mongoURI2, {
//   user: mongoUser2,
//   pass: mongoPass2,
//   dbName: "Nest_Js",
//   bufferCommands: false,
// });
// Nest_Js.on("error", (err) => console.error("Error koneksi DB2:", err));
// Nest_Js.once("open", () => console.log("✅ Koneksi DB2 berhasil terbuka"));
// ClickUsaha.on("error", (err) => console.error("Error koneksi DB1:", err));
// ClickUsaha.once("open", () => console.log("✅ Koneksi DB1 berhasil terbuka"));
// // Memuat variabel lingkungan dari file .env
// dotenv.config();
// URI MongoDB dari environment variable
const mongoURI = process.env.MongoDB_cloud_2 || "";
const mongoUser = process.env.MongoDB_user_2 || "";
const mongoPass = process.env.MongoDB_pass_2 || "";
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
