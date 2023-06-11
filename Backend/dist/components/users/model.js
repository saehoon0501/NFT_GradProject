"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const nftDb = (0, mongoose_1.createConnection)(config_1.default.mongoPath);
const userSchema = new mongoose_1.Schema({
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
            post_ids: { type: [mongoose_1.Schema.Types.ObjectId], ref: `post` },
            comment_ids: { type: [mongoose_1.Schema.Types.ObjectId], ref: `comment` },
            likes_ids: { type: [mongoose_1.Schema.Types.ObjectId], ref: `like` },
            profile_pic: { type: String, required: true },
        },
        required: true,
    },
    role: { type: String, required: true },
}, { strict: true });
const UserModel = nftDb.model("user", userSchema);
exports.UserModel = UserModel;
