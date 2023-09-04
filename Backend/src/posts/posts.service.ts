import { Container, Service } from "typedi";
import { Comment } from "./model/CommentEntity";
import { Post } from "./model/PostEntity";
import { IPostRepository } from "./posts.repository";
import { ILikeRepository } from "./likes.repository";
import { ICommentRepository } from "./comments.repository";
import { CommentLike, PostLike } from "./model/LikeEntity";
import { User } from "../users/model/UserEntity";

interface IPostService {
  getBestPosts: (lastWeek: Date, pageNum: number) => Promise<Post[]>;
  getPosts: (pageNum: number) => Promise<Post[]>;
  sanitize: (post_title: string) => string;
  createPost: (aPost: {
    user: Post["_id"];
    title: Post["title"];
    text: Post["text"];
  }) => Promise<Post>;
  deletePost: (post_id: Post["_id"]) => Promise<any>;
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
  getSearch: (keyword: string) => Promise<Post[]>;
}

@Service()
class PostService implements IPostService {
  constructor(
    private postRepository: IPostRepository,
    private likeRepository: ILikeRepository,
    private commentRepository: ICommentRepository
  ) {}
  getBestPosts(lastWeek: Date, pageNum: number) {
    return this.postRepository.getBestPosts(lastWeek, pageNum);
  }
  getPosts(pageNum: number) {
    return this.postRepository.getPosts(pageNum);
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

  //한 Transaction 내 작업 필요
  async createPost(aPost: {
    user: Post["_id"];
    title: Post["title"];
    text: Post["text"];
  }) {
    const post = await this.postRepository.createPost(aPost);
    const result = await this.likeRepository.createPostLike(post.id);

    if (!result) {
    }

    return post;
  }

  //한 Transaction 내 작업 필요
  async deletePost(post_id: Post["_id"]) {
    await this.likeRepository.deletePostLike(post_id);
    await this.commentRepository.deletePostComments(post_id);
    return await this.postRepository.deletePost(post_id);
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