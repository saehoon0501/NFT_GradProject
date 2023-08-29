import { User, UserModel } from "./model";
import { PostModel, CommentModel } from "../posts/model";
import { HydratedDocument } from "mongoose";

class userService {
  public static getUserByAddress = (
    publicAddress: string
  ): Promise<HydratedDocument<User>> => {
    return UserModel.findOne({ publicAddr: `${publicAddress}` }).exec();
  };

  public static getUserByID = (userId: string) => {
    return UserModel.findById({ _id: `${userId}` }).exec();
  };

  public static updateUserDescription = (
    publicAddress: string,
    caption: string,
    profileName: string
  ) => {
    return UserModel.updateOne(
      {
        publicAddr: `${publicAddress}`,
      },
      {
        $set: {
          "profile.username": `${profileName}`,
          "profile.caption": `${caption}`,
        },
      }
    ).exec();
  };

  public static updateUserPic = (
    publicAddress: string,
    profile_pic: string
  ) => {
    return UserModel.updateOne(
      {
        $and: [
          { publicAddr: `${publicAddress}` },
          { "ownerOfNFT.NFT_URL": `${profile_pic}` },
        ],
      },
      {
        $set: { "profile.profile_pic": `${profile_pic}` },
      }
    ).exec();
  };

  public static getUserPost = (publicAddress: string) => {
    return UserModel.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: PostModel.collection.name,
          localField: "profile.post_ids",
          foreignField: "_id",
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
    ]).exec();
  };

  public static getUserComment = (publicAddress: string) => {
    return UserModel.aggregate([
      { $match: { publicAddr: publicAddress } },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "profile.comment_ids",
          foreignField: "_id",
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
    ]).exec();
  };
}

export default userService;
