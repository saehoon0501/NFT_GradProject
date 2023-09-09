import { Container, Service } from "typedi";
import { Comment } from "./model/CommentEntity";
import { Post } from "./model/PostEntity";
import { IPostRepository } from "./repositories/posts.repository";
import { ILikeRepository } from "./repositories/likes.repository";
import { ICommentRepository } from "./repositories/comments.repository";
import { CommentLike, PostLike } from "./model/LikeEntity";
import { User } from "../users/model/UserEntity";

interface IPostService {
  getBestPosts: (lastWeek: Date, pageNum: number) => Promise<Post[]>;
  getRecentPosts: (pageNum: number) => Promise<Post[]>;
  getPost: (post_id: Post["_id"]) => Promise<Post>;
  sanitize: (post_title: string) => string;
  createPost: (aPost: {
    user: Post["_id"];
    title: Post["title"];
    text: Post["text"];
    uploads: Post["uploads"];
  }) => object;
  deletePost(
    { user_id, isAdmin }: { user_id: Post["user"]; isAdmin: string },
    post_id: Post["_id"]
  ): Promise<Post>;
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
  getComments: (post_id: Post["_id"]) => Promise<Comment[]>;
  getComment: (comment_id: Comment["_id"]) => Promise<Comment>;
  updateComment: (
    comment_id: Comment["_id"],
    context: Comment["context"]
  ) => Promise<any>;
  likeComment: (
    user_id: User["_id"],
    comment_id: CommentLike["comment_id"]
  ) => Promise<any>;
  unlikeComment: (
    user_id: User["_id"],
    comment_id: CommentLike["comment_id"]
  ) => Promise<any>;
  likePost: (
    user_id: User["_id"],
    post_id: PostLike["post_id"]
  ) => Promise<any>;
  unlikePost: (
    user_id: User["_id"],
    post_id: PostLike["post_id"]
  ) => Promise<any>;
  getReplies(reply_id: string): Promise<Comment[]>;
  getSearch: (keyword: string) => Promise<Post[]>;
}

@Service()
class PostService implements IPostService {
  constructor(
    private postRepository: IPostRepository,
    private likeRepository: ILikeRepository,
    private commentRepository: ICommentRepository
  ) {}
  getReplies(reply_id: string): Promise<Comment[]> {
    return this.commentRepository.getReplies(reply_id);
  }

  getComment(comment_id: any) {
    return this.commentRepository.getComment(comment_id);
  }

  getBestPosts(lastWeek: Date, pageNum: number) {
    return this.postRepository.getBestPosts(lastWeek, pageNum);
  }
  getRecentPosts(pageNum: number) {
    return this.postRepository.getRecentPosts(pageNum);
  }
  getPost(post_id: Post["_id"]) {
    return this.postRepository.getPost(post_id);
  }

  sanitize(post_title: string) {
    let result = post_title;
    if (result == undefined || !/([^\s])/.test(result)) {
      return "Need any character";
    }
    result = result.replace(/^\s+/g, "");
    result = result.replace(/\s+$/g, "");

    return result;
  }

  async createPost(aPost: {
    user: Post["_id"];
    title: Post["title"];
    text: Post["text"];
    uploads: Post["uploads"];
  }) {
    const result = await this.postRepository.createPost(
      aPost,
      this.likeRepository
    );
    return result;
  }

  async deletePost(
    { user_id, isAdmin }: { user_id: Post["user"]; isAdmin: string },
    post_id: Post["_id"]
  ) {
    return await this.postRepository.deletePost(
      { user_id, isAdmin },
      post_id,
      this.likeRepository,
      this.commentRepository
    );
  }

  async createPostComment(user_id: string, post_id: string, context: string) {
    const result = await this.commentRepository.createPostComment(
      user_id,
      post_id,
      context
    );
    await this.likeRepository.createCommentLike(result._id);
    return result;
  }

  getComments(post_id: string) {
    return this.commentRepository.getPostComments(post_id);
  }

  likeComment(user_id: string, comment_id: string) {
    return this.likeRepository.incrementCommentLike(user_id, comment_id);
  }

  unlikeComment(user_id: string, comment_id: string) {
    return this.likeRepository.decrementCommentLike(user_id, comment_id);
  }

  async createReplyComment(user_id: string, reply_id: string, context: string) {
    const result = await this.commentRepository.createReplyComment(
      user_id,
      reply_id,
      context
    );
    await this.likeRepository.createCommentLike(result._id);
    return result;
  }

  updateComment(comment_id: string, context: string) {
    return this.commentRepository.updateComment(comment_id, context);
  }

  likePost(user_id: User["_id"], post_id: string) {
    return this.likeRepository.incrementPostLike(user_id, post_id);
  }

  unlikePost(user_id: User["_id"], post_id: string) {
    return this.likeRepository.decrementPostLike(user_id, post_id);
  }

  getSearch(keyword: string) {
    return this.postRepository.getSearch(keyword);
  }
}

Container.set(
  "PostService",
  new PostService(
    Container.get("PostRepository"),
    Container.get("LikeRepository"),
    Container.get("CommentRepository")
  )
);

export { IPostService };
