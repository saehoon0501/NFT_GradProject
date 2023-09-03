import { Schema } from "mongoose";
import { DB } from "../../users/model/UserEntity";

interface Comment {
  _id: string;
  reply_id?: string;
  post_id?: string;
  user: string;
  context: string;
  createdAt: Schema.Types.Date;
}

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
    reply_id: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    context: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CommentModel = DB.model("comments", CommentSchema);

export { CommentModel, Comment };
