import { Schema, createConnection, Types } from "mongoose";
import { DATABASE_URL } from "../../config/dev";

const DB = createConnection(DATABASE_URL as string);

interface User {
  _id: Schema.Types.ObjectId;
  publicAddr: string;
  ownerOfNFT: {
    collection_id: string;
    NFT_URL: string[];
  }[];
  profile: {
    username: string;
    caption: string;
    points: number;
    profile_pic: string;
  };
  role: string;
}

const userSchema = new Schema<User>(
  {
    publicAddr: {
      type: String,
      required: true,
      unique: true,
    },
    ownerOfNFT: [
      {
        collection_id: { type: String },
        NFT_URL: [String],
      },
    ],
    profile: {
      type: {
        username: { type: String, required: true },
        caption: { type: String, required: true },
        points: { type: Number },
        profile_pic: { type: String, required: true },
      },
      required: true,
    },
    role: { type: String, required: true },
  },
  { strict: true }
);

const UserModel = DB.model("user", userSchema);

type socketUser = {
  profile_pic: string;
  username: string;
  publicAddr: string;
  socketId: string;
};

export { User, socketUser, UserModel, DB };
