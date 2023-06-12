import { Schema, createConnection } from "mongoose";
import config from "../../config";

const pollDb = createConnection(config.mongoPath);

interface Poll {
  _id: Schema.Types.ObjectId;
  title: string;
  options: { name: string; vote_count: number }[];
  votes: {
    user_id: Schema.Types.ObjectId;
    usedNFT: { collection_id: string; NFT_URL: string };
  }[];
}

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
const PollModel = pollDb.model("poll", pollSchema);

export { Poll, PollModel };
