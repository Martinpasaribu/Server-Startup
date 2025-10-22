import express, { Request, Response, NextFunction } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { CommentControllers } from "../controllers/comment_controllers";

const CommentsRouter : express.Router = express.Router();

// endpoint komentar utama
CommentsRouter.post("/", verifyToken, CommentControllers.addComment);

// endpoint reply/sub-komentar
CommentsRouter.post("/reply/:_id/:commentIndex", verifyToken, CommentControllers.addReply);


// ❤️ Like komentar
// Contoh endpoint: PUT /api/blog/:slug/comments/:commentId/like
CommentsRouter.put("/like-comment/:slug/:commentId",verifyToken,  CommentControllers.likeComment);

// ❤️ Like reply
// Contoh endpoint: PUT /api/blog/:slug/comments/:commentId/replies/:replyId/like
CommentsRouter.put(
  "/like-reply/:slug/:commentId/:replyId",
  verifyToken, CommentControllers.likeReply
);

export default CommentsRouter;
