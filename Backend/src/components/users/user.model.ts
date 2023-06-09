import * as mongoose from "mongoose";
import config from "../../config";
const Schema = mongoose.Schema;

const nftDb = mongoose.createConnection(config.mongoPath);

const userSchema = new Schema({
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
    username: { type: String },
    caption: { type: String },
    points: { type: Number },
    post_ids: [{ type: Schema.Types.ObjectId, ref: `post` }],
    comment_ids: [{ type: Schema.Types.ObjectId, ref: `comment` }],
    likes_ids: [{ type: Schema.Types.ObjectId, ref: `like` }],
    profile_pic: { type: String },
  },
  role: { type: String, required: true },
});

export = nftDb.model("user", userSchema);
