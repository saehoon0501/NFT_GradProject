import Container from "typedi";
import { User, UserModel } from "./model/UserEntity";
import { PostModel } from "../posts/model/PostEntity";
import { Comment, CommentModel } from "../posts/model/CommentEntity";
import { Model } from "mongoose";
import { Post } from "../posts/model/PostEntity";
const mongoose = require("mongoose");

interface IUserRepository {
  findByPublicAddress: (publicAddress: string) => Promise<User>;
  findById: (userId: string) => Promise<User>;
  updateUser: (
    user_id: string,
    {
      description,
      username,
      profile_pic,
    }: {
      description: string;
      username: string;
      profile_pic: string;
    }
  ) => Promise<any>;
  getUserPosts: (user_id: string) => Promise<Post[]>;
  getUserComments: (user_id: string) => Promise<Comment[]>;
  createUser(publicAddress: string): Promise<User>;
}

class MongoUserRepository implements IUserRepository {
  constructor(private repository: Model<User>) {}
  async findByPublicAddress(publicAddress: string) {
    const result = (await this.repository
      .findOne({ public_address: `${publicAddress}` })
      .exec()) as User;
    return result;
  }

  async findById(userId: string) {
    const result = (await this.repository
      .findById({ _id: userId })
      .cache({ key: userId })
      .exec()) as User;
    return result;
  }

  async updateUser(
    user_id: string,
    {
      description,
      username,
      profile_pic,
    }: {
      description: string;
      username: string;
      profile_pic: string;
    }
  ) {
    const result = await this.repository
      .updateOne(
        {
          $and: [{ _id: user_id }],
        },
        {
          $set: {
            username,
            description,
            profile_pic,
          },
        }
      )
      .exec();
    return result;
  }

  async createUser(publicAddress: string): Promise<User> {
    return await new this.repository({
      public_address: publicAddress,
      username: `user${publicAddress.slice(0, 10)}`,
      description: "Welcome!",
      profile_pic: " ",
      role: "user",
      owner_of_nft: [],
    }).save();
  }

  async getUserPosts(user_id: string) {
    const result = (await UserModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: PostModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "posts",
        },
      },
      { $unwind: "$posts" },
      {
        $lookup: {
          from: "post_likes",
          localField: "posts._id",
          foreignField: "post_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
      {
        $lookup: {
          from: "comments",
          localField: "posts._id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      { $unwind: "$likes" },
      {
        $project: {
          posts: 1,
          likes: 1,
          comments: 1,
        },
      },
    ])) as Post[];
    return result;
  }

  async getUserComments(user_id: string) {
    const result = (await UserModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "comments",
        },
      },
      { $unwind: "$comments" },
      {
        $project: {
          "comments._id": 1,
          "comments.user": 1,
          "comments.context": 1,
        },
      },
    ])) as Comment[];
    return result;
  }
}

Container.set("UserRepository", new MongoUserRepository(UserModel));

export { IUserRepository };
