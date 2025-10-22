import { Request, Response } from "express";
import mongoose from "mongoose";
import { BlogModel } from "../models/blog_models";


export class CommentControllers {

  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { user_key, text, name } = req.body;
      const { slug } = req.query;

      if (!text || !user_key || !name ) {
        res.status(400).json({ message: "Komentar kosong!" });
        return; // ✅ pastikan return
      }

      const blog = await BlogModel.findOne({ slug });
      if (!blog) {
        res.status(404).json({ message: "Blog tidak ditemukan" });
        return;
      }

      const newComment = {
        user_key: new mongoose.Types.ObjectId(user_key),
        name: name,
        text,
        likes: 0,
        replies: [],
        createdAt: new Date(),
      };

      blog.comments.push(newComment);
      await blog.save();

      res.status(200).json({ message: "Komentar ditambahkan!", comment: newComment });
      return; // ✅ pastikan return
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  static async addReply(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const { text, slug } = req.body;
      const { _id, commentIndex } = req.params;

      if (!text) {
        res.status(400).json({ message: "Reply kosong!" });
        return;
      }

      const blog = await BlogModel.findOne({slug});
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
        user_key: new mongoose.Types.ObjectId(user.id),
        name: user.name,
        text,
        likes: 0,
        createdAt: new Date(),
      };

      blog.comments[index].replies.push(newReply);
      await blog.save();

      res.status(200).json({ message: "Reply ditambahkan!", reply: newReply });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

// ❤️ Like komentar
static async likeComment(req: Request, res: Response): Promise<void> {
  try {
    const { slug, commentId } = req.params;
    const rawUserId = (req.user as any)?.id || (req.user as any)?._id;

    if (!rawUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // pastikan dalam bentuk ObjectId
    const userObjectId = new mongoose.Types.ObjectId(rawUserId);

    const blog = await BlogModel.findOne({ slug });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    const comment = blog.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // pastikan array likedBy selalu ada
    if (!Array.isArray(comment.likedBy)) comment.likedBy = [];

    // cek apakah user sudah like sebelumnya
    const alreadyLiked = comment.likedBy.some(
      (id: mongoose.Types.ObjectId) => id.toString() === userObjectId.toString()
    );

    if (alreadyLiked) {
      // unlike
      comment.likedBy = comment.likedBy.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== userObjectId.toString()
      );
      comment.likes = Math.max((comment.likes || 0) - 1, 0);
    } else {
      // like
      comment.likedBy.push(userObjectId);
      comment.likes = (comment.likes || 0) + 1;
    }

    await blog.save();

    res.json({
      message: alreadyLiked ? "Unliked comment" : "Liked comment",
      liked: !alreadyLiked,
      likes: comment.likes,
    });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ message: "Error liking comment", error: err });
  }
}


static async likeReply(req: Request, res: Response): Promise<void> {
  try {
    const { slug, commentId, replyId } = req.params;
    const rawUserId = (req.user as any)?.id || (req.user as any)?._id;

    if (!rawUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(rawUserId);

    const blog = await BlogModel.findOne({ slug });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    const comment = blog.comments.find(
      (c: any) => c._id.toString() === commentId
    );
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const reply = comment.replies.find(
      (r: any) => r._id.toString() === replyId
    );
    if (!reply) {
      res.status(404).json({ message: "Reply not found" });
      return;
    }

    if (!Array.isArray(reply.likedBy)) reply.likedBy = [];

    const alreadyLiked = reply.likedBy.some(
      (id: mongoose.Types.ObjectId) => id.toString() === userObjectId.toString()
    );

    if (alreadyLiked) {
      // unlike
      reply.likedBy = reply.likedBy.filter(
        (id: mongoose.Types.ObjectId) => id.toString() !== userObjectId.toString()
      );
      reply.likes = Math.max((reply.likes || 0) - 1, 0);
    } else {
      // like
      reply.likedBy.push(userObjectId);
      reply.likes = (reply.likes || 0) + 1;
    }

    await blog.save();

    res.json({
      message: alreadyLiked ? "Unliked reply" : "Liked reply",
      liked: !alreadyLiked,
      likes: reply.likes,
    });
  } catch (err) {
    console.error("Error liking reply:", err);
    res.status(500).json({ message: "Error liking reply", error: err });
  }
}



}

