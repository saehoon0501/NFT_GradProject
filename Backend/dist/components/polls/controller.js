"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
const service_2 = __importDefault(require("../users/service"));
class pollController {
}
_a = pollController;
pollController.getPoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poll_id = req.query.poll_id;
        let poll;
        if (poll_id === undefined) {
            poll = yield service_1.default.getAllPoll();
        }
        else {
            poll = yield service_1.default.getPollById(poll_id);
            if (!poll)
                throw new Error("Poll not found");
        }
        return res.send(poll);
    }
    catch (err) {
        console.log("getPoll: Poll.findById error", err);
        next(err);
    }
});
pollController.createPoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, options } = req.body;
        const publicAddress = res.locals.decoded.publicAddress;
        if (!title || !options)
            throw new Error("Need title, options");
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user || user.role != "admin")
            throw new Error("Non-Authorized User");
        let ObjectOptions = [];
        options.map((option) => {
            ObjectOptions.push({ name: option, vote_count: 0 });
        });
        //create new poll data
        const newPoll = service_1.default.createPoll(title, ObjectOptions);
        const result = yield newPoll.save();
        if (result.acknowleged == false) {
            throw new Error("Poll Not Created");
        }
        return res.send(result);
    }
    catch (err) {
        next(err);
    }
});
pollController.deletePoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poll_id = req.params.poll_id;
        const publicAddress = res.locals.decoded.publicAddress;
        console.log(poll_id);
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user || user.role != "admin") {
            throw new Error("Not Authorized");
        }
        const result = yield service_1.default.deletePoll("poll_id");
        return res.send(result);
    }
    catch (err) {
        console.log("getPoll: Poll.deleteOne error", err);
        next(err);
    }
});
pollController.votePoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poll_id = req.params.poll_id;
        const { voted_item, user_id, usedNFT } = req.body;
        if (!poll_id)
            throw new Error("No poll id");
        if (!user_id || !usedNFT || !usedNFT.collection_id || !usedNFT.NFT_URL)
            throw new Error("Parameter missing");
        if (!voted_item && voted_item != 0)
            throw new Error("Parameter missing");
        const user = yield service_2.default.getUserByID(user_id);
        if (!user)
            throw new Error("User Not Found");
        let owner = false;
        for (const collection of user.ownerOfNFT) {
            if (collection.collection_id === usedNFT.collection_id) {
                for (const nft of collection.NFT_URL) {
                    if (nft === usedNFT.NFT_URL) {
                        console.log("nft", nft, usedNFT.NFT_URL);
                        owner = true;
                        break;
                    }
                }
                if (owner)
                    break;
            }
        }
        if (!owner)
            throw new Error("Not The Owner");
        const poll = yield service_1.default.getPollById(poll_id);
        if (!poll)
            throw new Error("Poll Not Found");
        let check = false;
        poll.votes.map((vote) => {
            if (vote.usedNFT.NFT_URL == usedNFT.NFT_URL) {
                check = true;
                return;
            }
        });
        if (check)
            throw new Error("NFT Already Used For This Poll");
        if (voted_item >= poll.options.length || voted_item < 0)
            throw new Error("Invalid Option");
        poll.votes.push({ user_id, usedNFT });
        poll.options[voted_item].vote_count += 1;
        const result = yield poll.save();
        if (!result)
            throw new Error("Voting Stopped");
        return res.send(result);
    }
    catch (err) {
        console.log("votePoll: Poll.findById error", err);
        next(err);
    }
});
exports.default = pollController;
