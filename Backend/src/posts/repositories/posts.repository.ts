import { PostModel, Post } from "../model/PostEntity";
import Container from "typedi";
import mongoose, { HydratedDocument, Model } from "mongoose";
import { PostLike, PostLikeModel } from "../model/LikeEntity";
import { DB } from "../../users/model/UserEntity";
import { ILikeRepository } from "./likes.repository";
import { ICommentRepository } from "./comments.repository";
import { Comment } from "../model/CommentEntity";

interface IPostRepository {
  getBestPosts(lastWeek: Date, pageNum: number): Promise<any[]>; // 최근 일주일 동안 좋아요 수가 많은 순서대로 Post 10개를 가져온다.
  getRecentPosts(pageNum: number): Promise<any[]>; // 최근 추가된 순서대로 Post 10개를 가져온다.
  getPost(post_id: Post["_id"]): Promise<Post>;
  getSearch(keyword: string): Promise<Post[]>; // 검색한 문자열에 일치하는 제목 또는 내용의 post들을 가져온다.
  createPost(
    {
      user,
      title,
      text,
    }: {
      user: Post["_id"];
      title: Post["title"];
      text: Post["text"];
    },
    likeRepository: ILikeRepository
  ): object;
  deletePost(
    user_id: string,
    post_id: string,
    likeRepository: ILikeRepository,
    commentRepository: ICommentRepository
  ): object;
}

class MongoPostRepository implements IPostRepository {
  constructor(private repository: Model<Post>) {}

  getBestPosts(lastWeek: Date, pageNum: number) {
    return (
      this.repository
        .aggregate([
          { $match: { createdAt: { $gte: lastWeek } } },
          {
            $lookup: {
              from: "post_likes",
              localField: "_id",
              foreignField: "post_id",
              pipeline: [
                {
                  $match: { liked_num: { $gt: 0 } },
                },
              ],
              as: "likes",
            },
          },
          { $match: { "likes.liked_num": { $exists: true } } },
          { $sort: { "likes.liked_num": -1 } },
          { $skip: pageNum * 10 },
          { $limit: 10 },
          ...this.enrichPostQuery(),
        ])
        // .cache({ key: `BestPosts${pageNum}`, collection: this.repository })
        .exec()
    );
  }

  getRecentPosts(pageNum: number) {
    return (
      this.repository
        .aggregate([
          { $sort: { _id: -1 } },
          { $skip: pageNum * 10 },
          { $limit: 10 },
          {
            $lookup: {
              from: "post_likes",
              localField: "_id",
              foreignField: "post_id",
              as: "likes",
            },
          },
          ...this.enrichPostQuery(),
        ])
        // .cache({ key: `RecentPosts${pageNum}`, collection: this.repository })
        .exec()
    );
  }

  async getPost(post_id: Post["_id"]) {
    return (await this.repository.findById(post_id).exec()) as Post;
  }

  async createPost({ user, title, text }, likeRepository: ILikeRepository) {
    const session = await DB.startSession();
    try {
      await session.withTransaction(async () => {
        const post: HydratedDocument<Post> = new this.repository({
          user,
          title,
          text,
        });
        await post.save({ session });
        await likeRepository.createPostLike(post._id, session);
      });

      return {
        result: "OK",
      };
    } catch (err) {
      throw new Error(`${err}`);
    } finally {
      session.endSession();
    }
  }

  async deletePost(
    user_id: string,
    post_id: string,
    likeRepository: ILikeRepository,
    commentRepository: ICommentRepository
  ) {
    const session = await DB.startSession();
    try {
      const post = await this.repository.findOne({ _id: post_id });
      const comments = await commentRepository.getPostComments(post_id);
      const reply = ([] as Comment[]).concat(
        ...comments.map((comment) => comment.reply)
      );

      if (post && post.user.equals(user_id)) {
        await session.withTransaction(async () => {
          await Promise.all(likeRepository.deleteCommentLikes(reply, session));
          await Promise.all(
            likeRepository.deleteCommentLikes(comments, session)
          );
          await Promise.all(
            commentRepository.deleteCommentReplies(comments, session)
          );
          await commentRepository.deletePostComments(post_id, session);
          await likeRepository.deletePostLike(post_id, session);
          await this.repository.deleteOne({ _id: post_id }).session(session);
        });

        return { result: "OK" };
      }
      throw new Error("post not deleted");
    } catch (err) {
      throw new Error(`${err}`);
    } finally {
      session.endSession();
    }
  }

  private enrichPostQuery() {
    return [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $unwind: "$user",
      },
      { $unwind: "$likes" },
      {
        $project: {
          _id: 1,
          "user._id": 1,
          "user.profile_pic": 1,
          "user.username": 1,
          title: 1,
          text: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
        },
      },
    ];
  }

  getSearch(keyword: string) {
    return PostModel.aggregate([
      {
        $search: {
          compound: {
            must: [
              {
                text: {
                  query: keyword,
                  path: ["title", "text"],
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                },
              },
            ],
          },
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "post_likes",
          localField: "_id",
          foreignField: "post_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
      ...this.enrichPostQuery(),
    ])
      .cache({ key: keyword, collection: this.repository })
      .exec();
  }
}

Container.set("PostRepository", new MongoPostRepository(PostModel));

export { IPostRepository };
