"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const db_monggo_config_1 = require("../config/db_monggo_config");
// ======================
// 🧱 Schema untuk Reply
// ======================
const ReplySchema = new mongoose_1.Schema({
    user_key: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: false },
    text: { type: String, required: false },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] }], // <— daftar user yang like reply
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
// ======================
// 💬 Schema untuk Comment
// ======================
const CommentSchema = new mongoose_1.Schema({
    user_key: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: false },
    text: { type: String, required: false },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", default: [] }], // <— daftar user yang like comment
    replies: { type: [ReplySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });
// ======================
// 📰 Schema untuk Blog
// ======================
const BlogSchema = new mongoose_1.Schema({
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
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Author", required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// ======================
// 🚀 Export Model
// ======================
exports.BlogModel = db_monggo_config_1.Nest_Js.model("blogs", BlogSchema);
