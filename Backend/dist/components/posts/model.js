"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.LikeModel = exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const config = require("../../config");
const postDb = (0, mongoose_1.createConnection)(config.mongoPath);
const postSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    likes: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "like",
        required: true,
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "comment",
        required: true,
    },
}, { timestamps: true, strict: true });
const likeSchema = new mongoose_1.Schema({
    liked_num: {
        type: Number,
        default: 0,
    },
    liked_user: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    ],
});
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    liked_user: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    ],
    replies: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "comment",
        required: true,
    },
}, { timestamps: true });
const PostModel = postDb.model("post", postSchema);
exports.PostModel = PostModel;
const LikeModel = postDb.model("like", likeSchema);
exports.LikeModel = LikeModel;
const CommentModel = postDb.model("comment", commentSchema);
exports.CommentModel = CommentModel;
