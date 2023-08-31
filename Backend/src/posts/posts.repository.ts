import { PostModel, Post } from "./model/PostEntity";
import { UserModel } from "../users/model/UserEntity";
import { PostCommentModel } from "./model/CommentEntity";
import { PostLike, PostLikeModel } from "./model/LikeEntity";
import Container from "typedi";
import { HydratedDocument } from "mongoose";

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
  getBestPosts(lastWeek: Date, pageNum: number) {
    return PostModel.aggregate([
      { $match: { createdAt: { $gt: lastWeek } } },
      {
        $lookup: {
          from: PostLikeModel.collection.name,
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
      { $sort: { "likes.liked_num": -1 } },
      { $skip: pageNum * 10 },
      { $limit: 10 },
    ]);
  }

  getPosts(pageNum: number) {
    return PostModel.aggregate([
      { $sort: { _id: -1 } },
      { $skip: pageNum * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: PostLikeModel.collection.name,
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
    ]);
  }

  enrichPosts(post: any) {
    return post.aggregate([
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
          from: PostCommentModel.collection.name,
          localField: "comments",
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
    ]);
  }

  createPost({ user, title, text }) {
    const post: HydratedDocument<Post> = new PostModel({
      user,
      title,
      text,
    });
    return post.save();
  }
}

Container.set("PostRepository", new MongoPostRepository());

export { IPostRepository };
