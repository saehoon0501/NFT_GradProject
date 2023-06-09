import mongoose = require("mongoose");
import Schema = mongoose.Schema;
import config = require("../../config");

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
  { timestamps: true }
);

export = pollDb.model("poll", pollSchema);
