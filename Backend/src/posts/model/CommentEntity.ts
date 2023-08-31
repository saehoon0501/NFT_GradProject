import { Schema, createConnection } from "mongoose";
import { DB } from "../../users/model/UserEntity";

interface PostComment {
  _id: Schema.Types.ObjectId;
  post_id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  caption: string;
  createdAt: Schema.Types.Date;
}

interface ReplyComment {
  _id: Schema.Types.ObjectId;
  comment_id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  caption: string;
  createdAt: Schema.Types.Date;
}

const PostCommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ReplyCommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    comment_id: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostCommentModel = DB.model("post_comments", PostCommentSchema);
const ReplyCommentModel = DB.model("reply_comments", ReplyCommentSchema);

export { PostCommentModel, ReplyCommentModel, PostComment, ReplyComment };
