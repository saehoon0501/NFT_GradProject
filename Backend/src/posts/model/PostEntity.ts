import { Schema, createConnection } from "mongoose";
import { DB } from "../../users/model/UserEntity";

interface Post {
  _id: string;
  user: string;
  title: string;
  text?: string;
  createdAt: Date;
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
      default: "",
    },
  },
  { timestamps: true, strict: true }
);

const PostModel = DB.model("posts", postSchema);

export { PostModel, Post };
