import { ClientSession, Model } from "mongoose";
import { Container } from "typedi";
import { Comment, CommentModel } from "../model/CommentEntity";
const mongoose = require("mongoose");

interface getPostComments extends Comment {
  reply: Comment[];
}

interface ICommentRepository {
  getComment(comment_id: Comment["_id"]): Promise<Comment>;
  createPostComment: (
    user_id: string,
    post_id: string,
    context: string
  ) => Promise<Comment>;
  createReplyComment: (
    user_id: string,
    reply_id: string,
    context: string
  ) => Promise<Comment>;
  getPostComments: (post_id: string) => Promise<getPostComments[]>;
  getReplies: (reply_id: string) => Promise<Comment[]>; // comment를 id를 통해서 가져옴
  updateComment: (comment_id: string, context: string) => Promise<any>;
  deleteComment: (comment_id: string) => Promise<any>; // comment 데이터를 삭제하고 관련된 User와 Post에 반영
  deletePostComments: (post_id: string, session?: any) => Promise<any>;
  deleteCommentReplies(comments: Comment[], session?: any): Promise<any>[];
}

class MongoCommentRepository implements ICommentRepository {
  constructor(private repository: Model<Comment>) {}
  async getComment(comment_id: string): Promise<Comment> {
    return (await this.repository.findById(comment_id).exec()) as Comment;
  }

  async createPostComment(user: string, post_id: string, context: string) {
    return await new this.repository({
      user,
      post_id,
      context,
    }).save();
  }

  async createReplyComment(user: string, reply_id: string, context: string) {
    return await new this.repository({ user, reply_id, context }).save();
  }

  async getPostComments(post_id: string) {
    return this.repository
      .aggregate([
        {
          $match: { post_id: mongoose.Types.ObjectId(post_id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "comment_likes",
            localField: "_id",
            foreignField: "comment_id",
            as: "like",
          },
        },
        { $unwind: "$like" },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "reply_id",
            as: "reply",
          },
        },
        { $unwind: { path: "$reply", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "comment_likes",
            localField: "reply._id",
            foreignField: "comment_id",
            as: "reply_like",
          },
        },
        {
          $addFields: {
            "reply.like": {
              $arrayElemAt: ["$reply_like", 0],
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            user: { $first: "$user" },
            context: { $first: "$context" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            like: { $first: "$like" },
            reply: { $push: "$reply" },
          },
        },
        {
          $project: {
            post_id: 0,
            __v: 0,
            "user._id": 0,
            "user,__v": 0,
            "user.public_address": 0,
            "user.onwer_of_nft": 0,
            "user.points": 0,
            "user.role": 0,
            "user.owner_of_nft": 0,
            "like._id": 0,
            "like.comment_id": 0,
            "like.__v": 0,
            "reply.post_id": 0,
            "reply.reply_id": 0,
            "reply.__v": 0,
            "reply.like._id": 0,
            "reply.like.comment_id": 0,
            "reply.like.__v": 0,
          },
        },
      ])
      .exec();
  }

  async getReplies(reply_id: string) {
    return await this.repository
      .aggregate([
        {
          $match: { reply_id: mongoose.Types.ObjectId(reply_id) },
        },
        {
          $lookup: {
            from: "comment_likes",
            localField: "_id",
            foreignField: "comment_id",
            as: "reply_like",
          },
        },
      ])
      .exec();
  }

  async updateComment(comment_id: string, context: string) {
    return await this.repository
      .updateOne(
        { _id: comment_id },
        { $set: { context } },
        { $inc: { __v: 1 } }
      )
      .exec();
  }

  async deleteComment(comment_id: string) {
    return await this.repository.deleteOne({ comment_id }).exec();
  }

  deletePostComments(post_id: string, session: ClientSession) {
    return this.repository.deleteMany({ post_id }).session(session).exec();
  }

  deleteCommentReplies(comments: Comment[], session: ClientSession) {
    return comments.map(
      async (comment) =>
        await this.repository
          .deleteMany({ reply_id: comment._id })
          .session(session)
          .exec()
    );
  }
}

Container.set("CommentRepository", new MongoCommentRepository(CommentModel));

export { ICommentRepository };
