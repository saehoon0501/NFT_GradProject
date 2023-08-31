import Container from "typedi";
import { User, UserModel } from "./UserEntity";
import { CommentModel, PostModel } from "../posts/model";

interface IUserRepository {
  findByPublicAddress: (publicAddress: string) => User;
  findById: (userId: string) => User;
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
  ) => User;
  getUserPosts: (publicAddress: string) => any;
  getUserComments: (publicAddress: string) => any;
}

class MongoUserRepository implements IUserRepository {
  findByPublicAddress(publicAddress: string) {
    return UserModel.findOne({ publicAddr: `${publicAddress}` });
  }
  findById(userId: string) {
    return UserModel.findById({ _id: `${userId}` });
  }
  updateUser(
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
    return UserModel.updateOne(
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
    );
  }

  getUserPosts(publicAddress: string) {
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
    ]);
  }

  getUserComments(publicAddress: string) {
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
    ]);
  }
}

Container.set("UserRepository", new MongoUserRepository());

export { IUserRepository };
