"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const jwt_1 = require("../../middleware/jwt");
const postRouter = express_1.default.Router();
postRouter.route("/").get(jwt_1.verify, controller_1.default.getPost);
postRouter.route("/comment/:post_id").get(jwt_1.verify, controller_1.default.getComment);
postRouter.route("/search").get(jwt_1.verify, controller_1.default.getSearch);
postRouter.route("/").post(jwt_1.verify, controller_1.default.createPost);
postRouter.route("/comment/:post_id").post(jwt_1.verify, controller_1.default.addComment);
postRouter
    .route("/comment/like/:comment_id")
    .post(jwt_1.verify, controller_1.default.likeComment);
postRouter
    .route("/comment/reply/:comment_id")
    .post(jwt_1.verify, controller_1.default.addReply);
postRouter.route("/like").post(jwt_1.verify, controller_1.default.likePost);
postRouter
    .route("/comment/:comment_id")
    .patch(jwt_1.verify, controller_1.default.modifyComment);
postRouter.route("/unlike").patch(jwt_1.verify, controller_1.default.delLike);
postRouter.route("/:post_id").delete(jwt_1.verify, controller_1.default.delPost);
postRouter.route("/comment/:comment_id").delete(jwt_1.verify, controller_1.default.delComment);
postRouter
    .route("/comment/reply/:comment_id")
    .delete(jwt_1.verify, controller_1.default.delReply);
module.exports = postRouter;
