import { Schema, createConnection, Types } from "mongoose";
import { DATABASE_URL } from "../../config/dev";

const DB = createConnection(DATABASE_URL as string);

interface Post {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  title: string;
  text?: string;
  createdAt: Schema.Types.Date;
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
