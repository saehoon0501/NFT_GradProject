"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const pollDb = (0, mongoose_1.createConnection)(config_1.default.mongoPath);
let pollSchema = new mongoose_1.Schema({
    title: { type: String },
    options: [
        {
            name: { type: String },
            vote_count: { type: Number, default: 0 },
        },
    ],
    votes: [
        {
            user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: `user` },
            usedNFT: {
                collection_id: { type: String },
                NFT_URL: { type: String },
            },
        },
    ],
}, { timestamps: true, strict: true });
const PollModel = pollDb.model("poll", pollSchema);
exports.PollModel = PollModel;
