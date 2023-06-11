"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const model_2 = require("../posts/model");
class userService {
}
userService.getUserByAddress = (publicAddress) => {
    return model_1.UserModel.findOne({ publicAddr: `${publicAddress}` }).exec();
};
userService.getUserByID = (userId) => {
    return model_1.UserModel.findById({ _id: `${userId}` }).exec();
};
userService.updateUserDescription = (publicAddress, caption, profileName) => {
    return model_1.UserModel.updateOne({
        publicAddr: `${publicAddress}`,
    }, {
        $set: {
            "profile.username": `${profileName}`,
            "profile.caption": `${caption}`,
        },
    }).exec();
};
userService.updateUserPic = (publicAddress, profile_pic) => {
    return model_1.UserModel.updateOne({
        $and: [
            { publicAddr: `${publicAddress}` },
            { "ownerOfNFT.NFT_URL": `${profile_pic}` },
        ],
    }, {
        $set: { "profile.profile_pic": `${profile_pic}` },
    }).exec();
};
userService.getUserPost = (publicAddress) => {
    return model_1.UserModel.aggregate([
        { $match: { publicAddr: publicAddress } },
        {
            $lookup: {
                from: model_2.PostModel.collection.name,
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
userService.getUserComment = (publicAddress) => {
    return model_1.UserModel.aggregate([
        { $match: { publicAddr: publicAddress } },
        {
            $lookup: {
                from: model_2.CommentModel.collection.name,
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
exports.default = userService;
