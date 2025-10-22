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
exports.CommentControllers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const blog_models_1 = require("../models/blog_models");
class CommentControllers {
    static addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { user_key, text, name } = req.body;
                const { slug } = req.query;
                if (!text || !user_key || !name) {
                    res.status(400).json({ message: "Komentar kosong!" });
                    return; // ✅ pastikan return
                }
                const blog = yield blog_models_1.BlogModel.findOne({ slug });
                if (!blog) {
                    res.status(404).json({ message: "Blog tidak ditemukan" });
                    return;
                }
                const newComment = {
                    user_key: new mongoose_1.default.Types.ObjectId(user_key),
                    name: name,
                    text,
                    likes: 0,
                    replies: [],
                    createdAt: new Date(),
                };
                blog.comments.push(newComment);
                yield blog.save();
                res.status(200).json({ message: "Komentar ditambahkan!", comment: newComment });
                return; // ✅ pastikan return
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        });
    }
    static addReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { text, slug } = req.body;
                const { _id, commentIndex } = req.params;
                if (!text) {
                    res.status(400).json({ message: "Reply kosong!" });
                    return;
                }
                const blog = yield blog_models_1.BlogModel.findOne({ slug });
                if (!blog) {
                    res.status(404).json({ message: "Blog tidak ditemukan" });
                    return;
                }
                const index = parseInt(commentIndex, 10);
                if (isNaN(index) || index < 0 || index >= blog.comments.length) {
                    res.status(400).json({ message: "Index komentar tidak valid" });
                    return;
                }
                const newReply = {
                    user_key: new mongoose_1.default.Types.ObjectId(user.id),
                    name: user.name,
                    text,
                    likes: 0,
                    createdAt: new Date(),
                };
                blog.comments[index].replies.push(newReply);
                yield blog.save();
                res.status(200).json({ message: "Reply ditambahkan!", reply: newReply });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        });
    }
    // ❤️ Like komentar
    static likeComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { slug, commentId } = req.params;
                const rawUserId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
                if (!rawUserId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                // pastikan dalam bentuk ObjectId
                const userObjectId = new mongoose_1.default.Types.ObjectId(rawUserId);
                const blog = yield blog_models_1.BlogModel.findOne({ slug });
                if (!blog) {
                    res.status(404).json({ message: "Blog not found" });
                    return;
                }
                const comment = blog.comments.find((c) => c._id.toString() === commentId);
                if (!comment) {
                    res.status(404).json({ message: "Comment not found" });
                    return;
                }
                // pastikan array likedBy selalu ada
                if (!Array.isArray(comment.likedBy))
                    comment.likedBy = [];
                // cek apakah user sudah like sebelumnya
                const alreadyLiked = comment.likedBy.some((id) => id.toString() === userObjectId.toString());
                if (alreadyLiked) {
                    // unlike
                    comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userObjectId.toString());
                    comment.likes = Math.max((comment.likes || 0) - 1, 0);
                }
                else {
                    // like
                    comment.likedBy.push(userObjectId);
                    comment.likes = (comment.likes || 0) + 1;
                }
                yield blog.save();
                res.json({
                    message: alreadyLiked ? "Unliked comment" : "Liked comment",
                    liked: !alreadyLiked,
                    likes: comment.likes,
                });
            }
            catch (err) {
                console.error("Error liking comment:", err);
                res.status(500).json({ message: "Error liking comment", error: err });
            }
        });
    }
    static likeReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { slug, commentId, replyId } = req.params;
                const rawUserId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
                if (!rawUserId) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const userObjectId = new mongoose_1.default.Types.ObjectId(rawUserId);
                const blog = yield blog_models_1.BlogModel.findOne({ slug });
                if (!blog) {
                    res.status(404).json({ message: "Blog not found" });
                    return;
                }
                const comment = blog.comments.find((c) => c._id.toString() === commentId);
                if (!comment) {
                    res.status(404).json({ message: "Comment not found" });
                    return;
                }
                const reply = comment.replies.find((r) => r._id.toString() === replyId);
                if (!reply) {
                    res.status(404).json({ message: "Reply not found" });
                    return;
                }
                if (!Array.isArray(reply.likedBy))
                    reply.likedBy = [];
                const alreadyLiked = reply.likedBy.some((id) => id.toString() === userObjectId.toString());
                if (alreadyLiked) {
                    // unlike
                    reply.likedBy = reply.likedBy.filter((id) => id.toString() !== userObjectId.toString());
                    reply.likes = Math.max((reply.likes || 0) - 1, 0);
                }
                else {
                    // like
                    reply.likedBy.push(userObjectId);
                    reply.likes = (reply.likes || 0) + 1;
                }
                yield blog.save();
                res.json({
                    message: alreadyLiked ? "Unliked reply" : "Liked reply",
                    liked: !alreadyLiked,
                    likes: reply.likes,
                });
            }
            catch (err) {
                console.error("Error liking reply:", err);
                res.status(500).json({ message: "Error liking reply", error: err });
            }
        });
    }
}
exports.CommentControllers = CommentControllers;
