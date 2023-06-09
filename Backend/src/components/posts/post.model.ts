import mongoose = require("mongoose");
import Schema = mongoose.Schema;
import config = require("../../config");

const postDb = mongoose.createConnection(config.mongoPath);

let postSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

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

let commentSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const Post = postDb.model("post", postSchema);
const Like = postDb.model("like", likeSchema);
const Comment = postDb.model("comment", commentSchema);

export { Post, Like, Comment };
