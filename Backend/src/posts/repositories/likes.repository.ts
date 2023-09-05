import Container from "typedi";
import { ClientSession, Model, ObjectId, UpdateQuery } from "mongoose";
import {
  CommentLike,
  CommentLikeModel,
  PostLike,
  PostLikeModel,
} from "../model/LikeEntity";
import { Types } from "mongoose";
import { Comment } from "../model/CommentEntity";

interface ILikeRepository {
  getPostLike: (post_id: string) => Promise<PostLike>;
  getCommentLike: (comment_id: string) => Promise<CommentLike>;
  incrementPostLike: (user_id: string, post_id: string) => Promise<any>;
  incrementCommentLike: (user_id: string, comment_id: string) => Promise<any>;
  decrementPostLike: (user_id: string, like_id: string) => Promise<any>;
  decrementCommentLike: (user_id: string, like_id: string) => Promise<any>;
  createPostLike: (
    post_id: PostLike["post_id"],
    session?: any
  ) => Promise<PostLike>;
  createCommentLike: (
    comment_id: CommentLike["comment_id"]
  ) => Promise<CommentLike>;
  deletePostLike: (post_id: PostLike["post_id"], session?: any) => Promise<any>;
  deleteCommentLikes: (comments: Comment[], session: any) => Promise<any>[];
}

class MongoLikeRepository implements ILikeRepository {
  constructor(
    private postLikeRepository: Model<PostLike>,
    private commentLikeRepository: Model<CommentLike>
  ) {}

  async getPostLike(post_id: string) {
    return (await this.postLikeRepository
      .findOne({ post_id: post_id })
      .exec()) as PostLike;
  }

  async getCommentLike(comment_id: string) {
    return (await this.commentLikeRepository
      .findOne({ comment_id: comment_id })
      .exec()) as CommentLike;
  }

  async incrementPostLike(user_id: string, post_id: string) {
    return await this.postLikeRepository
      .updateOne(
        {
          post_id,
          liked_user: {
            $not: {
              $in: user_id,
            },
          },
        },
        { $addToSet: { liked_user: user_id }, $inc: { liked_num: 1 } }
      )
      .exec();
  }

  async incrementCommentLike(user_id: string, comment_id: string) {
    return await this.commentLikeRepository
      .updateOne(
        {
          comment_id,
          liked_user: {
            $not: {
              $in: user_id,
            },
          },
        },
        { $addToSet: { liked_user: user_id }, $inc: { liked_num: 1 } }
      )
      .exec();
  }

  async decrementPostLike(user_id: string, post_id: string) {
    return await this.postLikeRepository
      .updateOne(
        { post_id, liked_num: { $gt: 0 } },
        {
          $pull: { liked_user: user_id } as UpdateQuery<PostLike>,
          $inc: { liked_num: -1 },
        }
      )
      .exec();
  }

  async decrementCommentLike(user_id: string, comment_id: string) {
    return await this.commentLikeRepository
      .updateOne(
        { comment_id, liked_num: { $gt: 0 } },
        {
          $pull: { liked_user: user_id } as UpdateQuery<PostLike>,
          $inc: { liked_num: -1 },
        }
      )
      .exec();
  }

  async createPostLike(post_id: PostLike["post_id"], session: ClientSession) {
    return new this.postLikeRepository({ post_id }).save({ session });
  }

  async createCommentLike(comment_id: CommentLike["comment_id"]) {
    return new this.commentLikeRepository({ comment_id }).save();
  }

  async deletePostLike(post_id: PostLike["post_id"], session: ClientSession) {
    return await this.postLikeRepository
      .deleteOne({ post_id })
      .session(session)
      .exec();
  }

  deleteCommentLikes(comments: Comment[], session: ClientSession) {
    return comments.map(
      async (comment) =>
        await this.commentLikeRepository
          .deleteOne({ comment_id: comment._id })
          .session(session)
          .exec()
    );
  }
}

Container.set(
  "LikeRepository",
  new MongoLikeRepository(PostLikeModel, CommentLikeModel)
);

export { ILikeRepository };
