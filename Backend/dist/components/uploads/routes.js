"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const uploadRouter = express_1.default.Router();
uploadRouter
    .route("/")
    .post(controller_1.default.upload.single("file"), controller_1.default.returnURL);
module.exports = uploadRouter;
