import express from "express";
import controller from "./controller";

const postRouter = express.Router();

postRouter.route("/").get(controller.getPost);
postRouter.route("/comment/:post_id").get(controller.getComment);
postRouter.route("/search").get(controller.getSearch);

postRouter.route("/").post(controller.createPost);
postRouter.route("/comment/:post_id").post(controller.addComment);
postRouter.route("/comment/like/:comment_id").post(controller.likeComment);
postRouter.route("/comment/reply/:comment_id").post(controller.addReply);
postRouter.route("/like").post(controller.likePost);

postRouter.route("/comment/:comment_id").patch(controller.modifyComment);
postRouter.route("/unlike").patch(controller.delLike);

postRouter.route("/:post_id").delete(controller.delPost);
postRouter.route("/comment/:comment_id").delete(controller.delComment);
postRouter.route("/comment/reply/:comment_id").delete(controller.delReply);

export = postRouter;
