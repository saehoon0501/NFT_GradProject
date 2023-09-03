import { Model } from "mongoose";
import { Container } from "typedi";
import { Comment, CommentModel } from "./model/CommentEntity";

interface ICommentRepository {
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
  getPostComments: (post_id: string) => Promise<Comment[]>;
  getReplyComments: (reply_id: string) => Promise<Comment[]>; // comment를 id를 통해서 가져옴
  updateComment: (comment_id: string, context: string) => Promise<any>;
  deleteComment: (comment_id: string) => Promise<any>; // comment 데이터를 삭제하고 관련된 User와 Post에 반영
  deletePostComments: (post_id: string) => Promise<any>;
}

class MongoCommentRepository implements ICommentRepository {
  constructor(private repository: Model<Comment>) {}

  async createPostComment(user: string, post_id: string, context: string) {
    return await new this.repository({
      user,
      post_id,
      context,
    }).save();
  }

  async createReplyComment(user: string, reply_id: string, context: string) {
    console.log({ user, reply_id, context });
    return await new this.repository({ user, reply_id, context }).save();
  }

  async getPostComments(post_id: string) {
    return await this.repository.find({ post_id }).exec();
  }

  async getReplyComments(reply_id: string) {
    return await this.repository.find({ reply_id }).exec();
  }

  async updateComment(comment_id: string, context: string) {
    return await this.repository
      .updateOne({ _id: comment_id }, { $set: { context } })
      .exec();
  }

  async deleteComment(comment_id: string) {
    return await this.repository.deleteOne({ comment_id }).exec();
  }

  async deletePostComments(post_id: string) {
    return await this.repository.deleteMany({ post_id }).exec();
  }
}

Container.set("CommentRepository", new MongoCommentRepository(CommentModel));

export { ICommentRepository };
