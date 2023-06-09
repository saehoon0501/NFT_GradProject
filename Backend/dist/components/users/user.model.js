"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const Schema = mongoose.Schema;
const nftDb = mongoose.createConnection(config_1.default.mongoPath);
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
module.exports = nftDb.model("user", userSchema);
