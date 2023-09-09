import { Schema, createConnection } from "mongoose";
import { DB } from "../../users/model/UserEntity";

interface Post {
  _id: any;
  user: any;
  title: string;
  text?: string;
  createdAt: Date;
  uploads: string[];
}

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
    uploads: [{ type: String }],
  },
  { timestamps: true, strict: true }
);

const PostModel = DB.model("posts", postSchema);

export { PostModel, Post };
