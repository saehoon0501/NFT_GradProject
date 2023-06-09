"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Like = exports.Post = void 0;
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const config = require("../../config");
const postDb = mongoose.createConnection(config.mongoPath);
let postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "like",
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment",
        },
    ],
}, { timestamps: true });
let likeSchema = new Schema({
    liked_num: {
        type: Number,
        default: 0,
    },
    liked_user: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    ],
});
let commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    caption: {
        type: String,
    },
    liked_user: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment",
        },
    ],
}, { timestamps: true });
const Post = postDb.model("post", postSchema);
exports.Post = Post;
const Like = postDb.model("like", likeSchema);
exports.Like = Like;
const Comment = postDb.model("comment", commentSchema);
exports.Comment = Comment;
