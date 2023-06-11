import { Schema, createConnection, Types } from "mongoose";
import config = require("../../config");

const postDb = createConnection(config.mongoPath);

interface Post {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  title: string;
  text?: string;
  likes: Types.DocumentArray<Schema.Types.ObjectId>;
  comments: Types.DocumentArray<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

interface Like {
  _id: Schema.Types.ObjectId;
  liked_num: number;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
}

interface Comment {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  caption: string;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
  replies: Types.DocumentArray<Schema.Types.ObjectId>;
}

const postSchema = new Schema(
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
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comment",
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

const likeSchema = new Schema({
  liked_num: {
    type: Number,
    default: 0,
  },
  liked_user: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
});

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    liked_user: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    replies: {
      type: [Schema.Types.ObjectId],
      ref: "comment",
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = postDb.model("post", postSchema);
const LikeModel = postDb.model("like", likeSchema);
const CommentModel = postDb.model("comment", commentSchema);

export { PostModel, LikeModel, CommentModel, Post, Like, Comment };
