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
class userController {
}
_a = userController;
userController.getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user;
        if (req.query.userId == undefined) {
            const publicAddress = res.locals.decoded.publicAddress;
            user = yield service_1.default.getUserByAddress(publicAddress);
        }
        else {
            const publicAddress = req.query.userId.toLowerCase();
            user = yield service_1.default.getUserByAddress(publicAddress);
        }
        if (!user) {
            throw new Error("user cannot be found");
        }
        return res.json(user);
    }
    catch (err) {
        console.log("유저 정보 sndProfile: User.findOne Error", err);
        next(err);
    }
});
userController.updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result;
        const publicAddress = res.locals.decoded.publicAddress;
        const { caption, profileName, profile_pic } = req.body;
        if (caption || profileName) {
            result = yield service_1.default.updateUserDescription(publicAddress, caption, profileName);
        }
        if (profile_pic) {
            result = yield service_1.default.updateUserPic(publicAddress, profile_pic);
        }
        if (result.matchedCount == 0) {
            throw new Error("user cannot be updated");
        }
        return res.send("user info updated");
    }
    catch (err) {
        console.log("updateProfile: User.findOneandUpdate Error", err);
        next(err);
    }
});
userController.getUserPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result;
        const publicAddress = res.locals.decoded.publicAddress;
        result = yield service_1.default.getUserPost(publicAddress);
        if (!result)
            throw new Error("user cannot be found");
        return res.send(result);
    }
    catch (err) {
        console.log("getUerPost: User.aggregate error", err);
        return res.status(400).send(err);
    }
});
userController.getUserComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        let result = yield service_1.default.getUserComment(publicAddress);
        if (!result)
            throw new Error("user cannot be updated");
        return res.send(result[0]);
    }
    catch (err) {
        console.log("getUserComment: User.aggregate error", err);
        return res.status(400).send(err);
    }
});
exports.default = userController;
