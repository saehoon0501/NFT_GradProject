"use strict";
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const config = require("../../config");
const pollDb = mongoose.createConnection(config.mongoPath);
let pollSchema = new Schema({
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
}, { timestamps: true });
module.exports = pollDb.model("poll", pollSchema);
