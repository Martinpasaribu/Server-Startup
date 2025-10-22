import mongoose, { Schema, Document, Types } from "mongoose";
// import { Nest_Js } from "../config/db_monggo_config";

// ======================
// 🧩 Interface untuk Reply
// ======================
export interface Reply {
  _id?: string;
  user_key: mongoose.Types.ObjectId;
  name: string;
  text: string;
  likes: number;
  likedBy?: mongoose.Types.ObjectId[]; // <— daftar user yang sudah like
  createdAt: Date;
}

// ======================
// 💬 Interface untuk Comment
// ======================
export interface Comment {
  _id?: string;
  user_key: mongoose.Types.ObjectId;
  name: string;
  text: string;
  likes: number;
  likedBy?: mongoose.Types.ObjectId[]; // <— daftar user yang sudah like
  replies: Reply[];
  createdAt: Date;
}

// ======================
// 📰 Interface untuk Blog
// ======================
export interface BlogDocument extends Document {
  title: string;
  desc?: string;
  sub_desc?: string;
  slug: string;
  content?: string;
  comments: Types.DocumentArray<Comment & Document>;
  view: number;
  status?: string;
  image_bg?: string;
  images: string[];
  category?: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// ======================
// 🧱 Schema untuk Reply
// ======================
const ReplySchema = new Schema<Reply>(
  {
    user_key: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: false },
    text: { type: String, required: false },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // <— daftar user yang like reply
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ======================
// 💬 Schema untuk Comment
// ======================
const CommentSchema = new Schema<Comment>(
  {
    user_key: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: false },
    text: { type: String, required: false },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // <— daftar user yang like comment
    replies: { type: [ReplySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ======================
// 📰 Schema untuk Blog
// ======================
const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    desc: { type: String },
    sub_desc: { type: String },
    slug: { type: String, required: true, unique: true },
    content: { type: String },
    comments: { type: [CommentSchema], default: [] },
    view: { type: Number, default: 0 },
    status: { type: String },
    image_bg: { type: String },
    images: { type: [String], default: [] },
    category: { type: String },
    tags: { type: [String], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ======================
// 🚀 Export Model
// ======================
export const BlogModel = mongoose.model<BlogDocument>("blogs", BlogSchema);
