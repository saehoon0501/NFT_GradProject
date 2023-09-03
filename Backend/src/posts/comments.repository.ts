import { Model } from "mongoose";
import { Container } from "typedi";
import { Comment, CommentModel } from "./model/CommentEntity";

interface ICommentRepository {
  createPostComment: (user_id: string, post_id: string) => Promise<Comment>;
  createReplyComment: (comment_id: string) => Promise<Comment>;
  getPostComments: (post_id: string) => Promise<Comment[]>;
  getReplyComments: (reply_id: string) => Promise<Comment[]>; // comment를 id를 통해서 가져옴
  updateComment: (comment_id: string, caption: string) => Promise<any>;
  deleteComment: (comment_id: string) => Promise<any>; // comment 데이터를 삭제하고 관련된 User와 Post에 반영
  deletePostComments: (post_id: string) => Promise<any>;
}

class MongoCommentRepository implements ICommentRepository {
  constructor(private repository: Model<Comment>) {}

  async createPostComment(user_id: string, post_id: string) {
    return await new this.repository({ user: user_id, post_id }).save();
  }

  async createReplyComment(comment_id: string) {
    return await new this.repository({ comment_id }).save();
  }

  async getPostComments(post_id: string) {
    return await this.repository.find({ post_id }).exec();
  }

  async getReplyComments(reply_id: string) {
    return await this.repository.find({ reply_id }).exec();
  }

  async updateComment(comment_id: string, caption: string) {
    return await this.repository
      .updateOne({ comment_id }, { $set: { caption } })
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
