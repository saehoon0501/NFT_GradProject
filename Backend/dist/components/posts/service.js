"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const model_2 = require("../users/model");
const mongoose_1 = require("mongoose");
const socket_1 = require("../../socket");
class postService {
}
_a = postService;
postService.getBestPosts = (lastWeek, pageNum) => {
    return model_1.PostModel.aggregate([
        { $match: { createdAt: { $gt: lastWeek } } },
        {
            $lookup: {
                from: model_1.LikeModel.collection.name,
                localField: "likes",
                foreignField: "_id",
                as: "likes",
            },
        },
        { $unwind: "$likes" },
        { $sort: { "likes.liked_num": -1 } },
        { $skip: pageNum * 10 },
        { $limit: 10 },
        {
            $lookup: {
                from: model_2.UserModel.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $lookup: {
                from: model_1.CommentModel.collection.name,
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
                "comments._id": 1,
                createdAt: 1,
            },
        },
        { $unwind: "$user" },
    ]).exec();
};
postService.getPosts = (pageNum) => {
    return model_1.PostModel.aggregate([
        { $sort: { _id: -1 } },
        { $skip: pageNum * 10 },
        { $limit: 10 },
        {
            $lookup: {
                from: model_2.UserModel.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $lookup: {
                from: model_1.CommentModel.collection.name,
                localField: "comments",
                foreignField: "_id",
                as: "comments",
            },
        },
        {
            $lookup: {
                from: model_1.LikeModel.collection.name,
                localField: "likes",
                foreignField: "_id",
                as: "likes",
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
        { $unwind: "$likes" },
    ]).exec();
};
postService.createLike = () => {
    const like = new model_1.LikeModel({});
    return like.save();
};
postService.createPost = ({ user, title, text, likes }) => {
    const post = new model_1.PostModel({
        user,
        title,
        text,
        likes,
    });
    return post.save();
};
postService.findPost = (post_id) => {
    return model_1.PostModel.findById(post_id).lean();
};
postService.deletePost = (post_id, post, user) => {
    user.profile.post_ids.pull(post_id);
    return Promise.all([
        model_1.PostModel.deleteOne({ _id: post_id }),
        model_1.LikeModel.deleteOne({ _id: post.likes }),
        user.save(),
        post.comments.map((comment_id) => {
            model_1.CommentModel.findById(comment_id)
                .lean()
                .then((comment) => {
                if (comment.replies.length > 0) {
                    comment.replies.map((reply_id) => __awaiter(void 0, void 0, void 0, function* () {
                        console.log("reply_id", reply_id);
                        yield model_1.CommentModel.deleteOne({ _id: reply_id });
                    }));
                }
                model_1.CommentModel.deleteOne({ _id: comment_id }).then((result) => console.log("delPost comment deleted", result));
            });
        }),
    ]);
};
postService.getLike = (like_id) => {
    return model_1.LikeModel.findById(like_id);
};
postService.getComments = (post_id) => {
    return model_1.PostModel.aggregate([
        { $match: { _id: new mongoose_1.Types.ObjectId(post_id) } },
        {
            $lookup: {
                from: model_1.CommentModel.collection.name,
                localField: "comments",
                foreignField: "_id",
                as: "comments",
            },
        },
        { $unwind: "$comments" },
        { $project: { comments: 1 } },
        {
            $lookup: {
                from: model_2.UserModel.collection.name,
                localField: "comments.user",
                foreignField: "_id",
                as: "comments.user",
            },
        },
        { $unwind: "$comments.user" },
        {
            $project: {
                "comments._id": 1,
                "comments.user._id": 1,
                "comments.user.profile.username": 1,
                "comments.user.profile.caption": 1,
                "comments.user.profile.profile_pic": 1,
                "comments.caption": 1,
                "comments.liked_user": 1,
                "comments.replies": 1,
                "comments.updatedAt": 1,
                "comments.__v": 1,
            },
        },
        {
            $lookup: {
                from: model_1.CommentModel.collection.name,
                localField: "comments.replies",
                foreignField: "_id",
                as: "comments.replies",
            },
        },
        {
            $unwind: {
                path: "$comments.replies",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: model_2.UserModel.collection.name,
                localField: "comments.replies.user",
                foreignField: "_id",
                as: "comments.replies.user",
            },
        },
        {
            $unwind: {
                path: "$comments.replies.user",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                "comments.replies.user.publicAddr": 0,
                "comments.replies.user.ownerOfNFT": 0,
                "comments.replies.user.profile.post_ids": 0,
                "comments.replies.user.profile.comment_ids": 0,
                "comments.replies.user.profile.points": 0,
                "comments.replies.user.profile.liked_user": 0,
                "comments.replies.user.__v": 0,
                "comments.replies.replies": 0,
                "comments.replies.createdAt": 0,
            },
        },
        {
            $group: {
                _id: "$comments._id",
                user: { $first: "$comments.user" },
                caption: { $first: "$comments.caption" },
                liked_user: { $first: "$comments.liked_user" },
                updatedAt: { $first: "$comments.updatedAt" },
                replies: { $push: "$comments.replies" },
                __v: { $first: "$comments.__v" },
            },
        },
    ]).sort({ updatedAt: 1 });
};
postService.updateComment = ({ user, caption, replies }, publicAddress, post_id) => {
    const comment = new model_1.CommentModel({ user, caption, replies });
    return Promise.all([
        model_2.UserModel.updateOne({ publicAddr: publicAddress }, { $addToSet: { "profile.comment_ids": comment._id } }),
        model_1.PostModel.updateOne({ _id: post_id }, { $addToSet: { comments: comment._id } }),
        comment.save(),
    ]).then(() => {
        socket_1.io.of("/comment").to(post_id).emit("getNotification", `commentAdded`);
    });
};
postService.getCommentById = (comment_id) => {
    return model_1.CommentModel.findById(comment_id);
};
postService.deleteComment = (user, comment, post) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (String(user._id) === String(comment.user)) {
            if (comment.replies.length <= 0) {
                post.comments.pull(String(comment._id));
                yield model_1.CommentModel.deleteOne({ _id: String(comment._id) });
            }
            else {
                comment.caption = "삭제된 내용입니다.";
                yield comment.save();
            }
            user.profile.comment_ids.pull(String(comment._id));
            return Promise.all([user.save(), post.save()]);
        }
    }
    catch (err) {
        throw new Error("Comment Deletion Failed");
    }
});
postService.getPostById = (post_id) => {
    return model_1.PostModel.findById(post_id);
};
postService.deleteReply = (user, reply, comment) => __awaiter(void 0, void 0, void 0, function* () {
    let isInArray = comment.replies.some((replyItem) => {
        return String(replyItem) === String(reply._id);
    });
    if (String(user._id) === String(reply.user) && isInArray) {
        reply.caption = "삭제된 내용입니다.";
        return reply.save();
    }
    return null;
});
postService.getSearch = (keyword) => {
    return model_1.PostModel.aggregate([
        {
            $search: {
                index: "contentIndex",
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
                from: model_2.UserModel.collection.name,
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: model_1.LikeModel.collection.name,
                localField: "likes",
                foreignField: "_id",
                as: "likes",
            },
        },
        { $unwind: "$likes" },
        {
            $project: {
                _id: 1,
                "user._id": 1,
                "user.profile.username": 1,
                "user.profile.profile_pic": 1,
                createdAt: 1,
                title: 1,
                text: 1,
                comments: 1,
                likes: 1,
                score: { $meta: "searchScore" },
            },
        },
    ]);
};
postService.addReply = (user, comment, context) => __awaiter(void 0, void 0, void 0, function* () {
    const newComment = new model_1.CommentModel({
        user: user._id,
        caption: context,
        replies: [],
    });
    comment.replies.push(newComment._id);
    return Promise.all([newComment.save(), user.save(), comment.save()]);
});
exports.default = postService;
