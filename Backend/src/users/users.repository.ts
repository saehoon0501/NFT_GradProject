import Container from "typedi";
import { User, UserModel } from "./model/UserEntity";
import { PostModel } from "../posts/model/PostEntity";
import { PostComment, PostCommentModel } from "../posts/model/CommentEntity";
import { Model } from "mongoose";
import { Post } from "../posts/model/PostEntity";

interface IUserRepository {
  findByPublicAddress: (publicAddress: string) => Promise<User>;
  findById: (userId: string) => Promise<User>;
  updateUser: (
    publicAddress: string,
    {
      caption,
      profileName,
      profile_pic,
    }: {
      caption: string;
      profileName: string;
      profile_pic: string;
    }
  ) => Promise<any>;
  getUserPosts: (publicAddress: string) => Promise<Post[]>;
  getUserComments: (publicAddress: string) => Promise<PostComment[]>;
}

class MongoUserRepository implements IUserRepository {
  constructor(private repository: Model<User>) {}
  async findByPublicAddress(publicAddress: string) {
    const result = (await this.repository
      .findOne({ publicAddr: `${publicAddress}` })
      .exec()) as User;
    return result;
  }

  async findById(userId: string) {
    const result = (await this.repository
      .findById({ _id: `${userId}` })
      .exec()) as User;
    return result;
  }

  async updateUser(
    publicAddress: string,
    {
      caption,
      profileName,
      profile_pic,
    }: {
      caption: string;
      profileName: string;
      profile_pic: string;
    }
  ) {
    const result = await this.repository
      .updateOne(
        {
          $and: [
            { publicAddr: `${publicAddress}` },
            { "ownerOfNFT.NFT_URL": `${profile_pic}` },
          ],
        },
        {
          $set: {
            "profile.username": `${profileName}`,
            "profile.caption": `${caption}`,
            "profile.profile_pic": `${profile_pic}`,
          },
        }
      )
      .exec();
    return result;
  }

  async getUserPosts(publicAddress: string) {
    const result = (await UserModel.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: PostModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "posts",
        },
      },
      {
        $project: {
          ownerOfNFT: 0,
          profile: 0,
          "posts.updatedAt": 0,
          "posts.user": 0,
        },
      },
    ])) as Post[];
    return result;
  }

  async getUserComments(publicAddress: string) {
    const result = (await UserModel.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: PostCommentModel.collection.name,
          localField: "_id",
          foreignField: "user",
          as: "comments",
        },
      },
      {
        $project: {
          "comments._id": 1,
          "comments.caption": 1,
          "comments.updatedAt": 1,
        },
      },
    ])) as PostComment[];
    return result;
  }
}

Container.set("UserRepository", new MongoUserRepository(UserModel));

export { IUserRepository };
