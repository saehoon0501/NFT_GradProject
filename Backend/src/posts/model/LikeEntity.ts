import { Schema, Types } from "mongoose";
import { DB } from "../../users/model/UserEntity";

interface PostLike {
  post_id: string;
  liked_num: number;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

interface CommentLike {
  comment_id: string;
  liked_num: number;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

const PostLikeSchema = new Schema({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
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

const CommentLikeSchema = new Schema({
  comment_id: {
    type: Schema.Types.ObjectId,
    ref: "comment",
    required: true,
  },
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

const PostLikeModel = DB.model("post_likes", PostLikeSchema);
const CommentLikeModel = DB.model("comment_likes", CommentLikeSchema);

export { PostLikeModel, CommentLikeModel, CommentLike, PostLike };
