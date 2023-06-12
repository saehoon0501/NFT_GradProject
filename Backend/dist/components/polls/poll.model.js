"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const Schema = mongoose_1.default.Schema;
const pollDb = mongoose_1.default.createConnection(config_1.default.mongoPath);
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
const Poll = pollDb.model("poll", pollSchema);
exports.Poll = Poll;
