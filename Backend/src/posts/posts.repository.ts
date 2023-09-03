import { PostModel, Post } from "./model/PostEntity";
import { UserModel } from "../users/model/UserEntity";
import { CommentModel } from "./model/CommentEntity";
import { PostLike, PostLikeModel } from "./model/LikeEntity";
import Container from "typedi";
import { HydratedDocument, Model } from "mongoose";
const mongoose = require("mongoose");

interface IPostRepository {
  getBestPosts; // 최근 일주일 동안 좋아요 수가 많은 순서대로 Post 10개를 가져온다.
  getPosts; // 최근 추가된 순서대로 Post 10개를 가져온다.
  getComments; // post에 있는 comment들을 가져옴
  getPostById; // post를 id를 통해서 가져옴
  getSearch; // 검색한 문자열에 일치하는 제목 또는 내용의 post들을 가져온다.
  findPost; // getPostById와 동일(중복)
  createPost; // Post 데이터를 생성
  deletePost; // Post 항목을 삭제하고 이와 관련된 comment들과 좋아요도 다 삭제한다.
}

class MongoPostRepository {
  constructor(private repository: Model<Post>) {}

  getBestPosts(lastWeek: Date, pageNum: number) {
    return this.repository
      .aggregate([
        { $match: { createdAt: { $gte: lastWeek } } },
        {
          $lookup: {
            from: PostLikeModel.collection.name,
            localField: "_id",
            foreignField: "post_id",
            as: "likes",
          },
        },
        { $unwind: "$likes" },
        { $sort: { "likes.liked_num": -1 } },
        { $skip: pageNum * 10 },
        { $limit: 10 },
      ])
      .exec();
  }

  getPosts(pageNum: number) {
    return this.repository
      .aggregate([
        { $sort: { _id: -1 } },
        { $skip: pageNum * 10 },
        { $limit: 10 },
        {
          $lookup: {
            from: PostLikeModel.collection.name,
            localField: "_id",
            foreignField: "post_id",
            as: "likes",
          },
        },
        { $unwind: "$likes" },
      ])
      .exec();
  }

  enrichPosts(post: any) {
    return post
      .aggregate([
        {
          $lookup: {
            from: UserModel.collection.name,
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: CommentModel.collection.name,
            localField: "post_id",
            foreignField: "_id",
            as: "comments",
          },
        },
        {
          $project: {
            _id: 1,
            "user._id": 1,
            "user.publicAddr": 1,
            "user.profile.profile_pic": 1,
            "user.profile.username": 1,
            "user.profile.caption": 1,
            "user.profile.points": 1,
            title: 1,
            text: 1,
            likes: 1,
            comments: 1,
            createdAt: 1,
          },
        },
        { $unwind: "$user" },
      ])
      .exec();
  }

  createPost({ user, title, text }) {
    const post: HydratedDocument<Post> = new this.repository({
      user,
      title,
      text,
    });
    return post.save();
  }

  deletePost(post_id: string) {
    return PostModel.deleteOne({ _id: post_id }).exec();
  }
}

Container.set("PostRepository", new MongoPostRepository(PostModel));

export { IPostRepository };
