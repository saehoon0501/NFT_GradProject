"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const jwt_1 = require("../../middleware/jwt");
const pollRouter = express_1.default.Router();
pollRouter.route("/").get(jwt_1.verify, controller_1.default.getPoll);
pollRouter.route("/").post(jwt_1.verify, controller_1.default.createPoll);
pollRouter.route("/:poll_id").patch(jwt_1.verify, controller_1.default.votePoll);
pollRouter.route("/:poll_id").delete(jwt_1.verify, controller_1.default.deletePoll);
module.exports = pollRouter;
