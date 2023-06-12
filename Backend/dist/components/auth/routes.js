"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const authRouter = express_1.default.Router();
authRouter.route("/").post(controller_1.default.sndJwt);
authRouter.route("/").get(controller_1.default.sndNonce);
module.exports = authRouter;
