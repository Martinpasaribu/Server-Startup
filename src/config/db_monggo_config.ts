import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

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
const mongoURI: string = process.env.MongoDB_cloud || "";
const mongoUser: string = process.env.MongoDB_user || "";
const mongoPass: string = process.env.MongoDB_pass || "";

// console.log(" Env : ", process.env.MongoDB_cloud);

if (!mongoURI) {
  throw new Error("MongoDB URI tidak ditemukan di environment variables.");
}

// Fungsi untuk menginisialisasi koneksi
export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI, {
        user: mongoUser,
        pass: mongoPass,
    });
    console.log("MongoDB berhasil terhubung.");
  } catch (error) {
    console.error("Gagal terhubung ke MongoDB:", error);
    process.exit(1); // Keluar dengan kode error
  }
};

// Event handler untuk koneksi
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Error pada koneksi MongoDB:", err);
});

db.once("open", () => {
  console.log("Koneksi ke MongoDB telah terbuka.");
});

export default db;


