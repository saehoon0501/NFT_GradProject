import mongoose from "mongoose";
import config from "../../config";

const Schema = mongoose.Schema;
const pollDb = mongoose.createConnection(config.mongoPath);

let pollSchema = new Schema(
  {
    title: { type: String },
    options: [
      {
        name: { type: String },
        vote_count: { type: Number, default: 0 },
      },
    ],
    votes: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: `user` },
        usedNFT: {
          collection_id: { type: String },
          NFT_URL: { type: String },
        },
      },
    ],
  },
  { timestamps: true, strict: true }
);
const Poll = pollDb.model("poll", pollSchema);

export { Poll };
