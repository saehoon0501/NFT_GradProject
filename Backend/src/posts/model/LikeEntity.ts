import { Schema, createConnection, Types } from "mongoose";
import { DATABASE_URL } from "../../config/dev";

const DB = createConnection(DATABASE_URL as string);

interface PostLike {
  _id: Schema.Types.ObjectId;
  post_id: Schema.Types.ObjectId;
  liked_num: number;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

interface CommentLike {
  _id: Schema.Types.ObjectId;
  comment_id: Schema.Types.ObjectId;
  liked_num: number;
  liked_user: Types.DocumentArray<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

const PostLikeSchema = new Schema<PostLike>({
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

const CommentLikeSchema = new Schema<CommentLike>({
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
