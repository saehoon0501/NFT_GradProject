"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const Schema = mongoose_1.default.Schema;
const nftDb = mongoose_1.default.createConnection(config_1.default.mongoPath);
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
const User = nftDb.model("User", userSchema);
exports.User = User;
