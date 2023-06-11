"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const jwt_1 = require("../../middleware/jwt");
const userRouter = express_1.default.Router();
userRouter.route("").get(jwt_1.verify, controller_1.default.getProfile);
userRouter.route("/posts").get(jwt_1.verify, controller_1.default.getUserPost);
userRouter.route("/comments").get(jwt_1.verify, controller_1.default.getUserComment);
userRouter.route("/").patch(jwt_1.verify, controller_1.default.updateProfile);
module.exports = userRouter;
