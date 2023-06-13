import { Schema, createConnection, Types } from "mongoose";

const nftDb = createConnection(process.env.DATABASE_URL as string);

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
    post_ids: Types.DocumentArray<Schema.Types.ObjectId>;
    comment_ids: Types.DocumentArray<Schema.Types.ObjectId>;
    likes_ids: Types.DocumentArray<Schema.Types.ObjectId>;
    profile_pic: string;
  };
  role: string;
}

const userSchema = new Schema(
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
        post_ids: { type: [Schema.Types.ObjectId], ref: `post` },
        comment_ids: { type: [Schema.Types.ObjectId], ref: `comment` },
        likes_ids: { type: [Schema.Types.ObjectId], ref: `like` },
        profile_pic: { type: String, required: true },
      },
      required: true,
    },
    role: { type: String, required: true },
  },
  { strict: true }
);

const UserModel = nftDb.model("user", userSchema);

type socketUser = {
  profile_pic: string;
  username: string;
  publicAddr: string;
  socketId: string;
};

export { User, socketUser, UserModel };
