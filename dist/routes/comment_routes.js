"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const comment_controllers_1 = require("../controllers/comment_controllers");
const CommentsRouter = express_1.default.Router();
// endpoint komentar utama
CommentsRouter.post("/", verifyToken_1.verifyToken, comment_controllers_1.CommentControllers.addComment);
// endpoint reply/sub-komentar
CommentsRouter.post("/reply/:_id/:commentIndex", verifyToken_1.verifyToken, comment_controllers_1.CommentControllers.addReply);
// ❤️ Like komentar
// Contoh endpoint: PUT /api/blog/:slug/comments/:commentId/like
CommentsRouter.put("/like-comment/:slug/:commentId", verifyToken_1.verifyToken, comment_controllers_1.CommentControllers.likeComment);
// ❤️ Like reply
// Contoh endpoint: PUT /api/blog/:slug/comments/:commentId/replies/:replyId/like
CommentsRouter.put("/like-reply/:slug/:commentId/:replyId", verifyToken_1.verifyToken, comment_controllers_1.CommentControllers.likeReply);
exports.default = CommentsRouter;
