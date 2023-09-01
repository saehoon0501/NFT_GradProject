import Container from "typedi";
import { Model } from "mongoose";
import {
  CommentLike,
  CommentLikeModel,
  PostLike,
  PostLikeModel,
} from "./model/LikeEntity";

interface ILikeRepository {
  getPostLike: (post_id: string) => Promise<PostLike>;
  getCommentLike: (comment_id: string) => Promise<CommentLike>;
  incrementPostLike: (user_id: string, like_id: string) => Promise<any>;
  incrementCommentLike: (user_id: string, like_id: string) => Promise<any>;
  decrementPostLike: (user_id: string, like_id: string) => Promise<any>;
  decrementCommentLike: (user_id: string, like_id: string) => Promise<any>;
  createPostLike: () => Promise<PostLike>;
  createCommentLike: () => Promise<CommentLike>;
  deletePostLike: (like_id: string) => Promise<any>;
  deleteCommentLike: (like_id: string) => Promise<any>;
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

  async incrementPostLike(user_id: string, like_id: string) {
    return await this.postLikeRepository
      .updateOne(
        { _id: like_id },
        { $addToset: { liked_user: user_id }, $inc: { liked_num: 1 } }
      )
      .exec();
  }

  async incrementCommentLike(user_id: string, like_id: string) {
    return await this.commentLikeRepository
      .updateOne(
        { _id: like_id },
        { $addToset: { liked_user: user_id }, $inc: { liked_num: 1 } }
      )
      .exec();
  }

  async decrementPostLike(user_id: string, like_id: string) {
    return await this.postLikeRepository
      .updateOne(
        { _id: like_id },
        { $pull: { liked_user: { $match: user_id } }, $inc: { liked_num: -1 } }
      )
      .exec();
  }

  async decrementCommentLike(user_id: string, like_id: string) {
    return await this.commentLikeRepository.updateOne(
      { _id: like_id },
      { $pull: { liked_user: { $match: user_id } }, $inc: { liked_num: -1 } }
    );
  }

  async createPostLike() {
    return new this.postLikeRepository().save();
  }

  async createCommentLike() {
    return new this.commentLikeRepository().save();
  }

  async deletePostLike(like_id: string) {
    return await this.postLikeRepository.deleteOne({ _id: like_id });
  }

  async deleteCommentLike(like_id: string) {
    return await this.commentLikeRepository.deleteOne({ _id: like_id });
  }
}

Container.set(
  "LikeRepository",
  new MongoLikeRepository(PostLikeModel, CommentLikeModel)
);

export { ILikeRepository };
