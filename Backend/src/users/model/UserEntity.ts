import { Schema, createConnection, Types } from "mongoose";
import { DATABASE_URL } from "../../config/dev";

const DB = createConnection(DATABASE_URL as string);

interface User {
  _id: string;
  public_address: string;
  owner_of_nft: {
    collection_id: string;
    nft_url: string[];
  }[];

  username: string;
  description: string;
  points: number;
  profile_pic: string;

  role: string;
}

const userSchema = new Schema<User>(
  {
    public_address: {
      type: String,
      required: true,
      unique: true,
    },
    owner_of_nft: [
      {
        collection_id: { type: String },
        nft_url: [String],
      },
    ],
    username: { type: String, required: true },
    description: { type: String, required: true },
    points: { type: Number },
    profile_pic: { type: String, required: true },
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
