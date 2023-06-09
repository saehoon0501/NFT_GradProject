const express = require("express");
const controller = require("./controller");
const verify = require("../../../middleware/jwt");

const postRouter = express.Router();

postRouter.route("/").get(verify, controller.getPost);
postRouter.route("/comment/:post_id").get(verify, controller.getComment);
postRouter.route("/search").get(verify, controller.getSearch);

postRouter.route("/").post(verify, controller.createPost);
postRouter.route("/comment/:post_id").post(verify, controller.addComment);
postRouter
  .route("/comment/like/:comment_id")
  .post(verify, controller.likeComment);
postRouter
  .route("/comment/reply/:comment_id")
  .post(verify, controller.addReply);
postRouter.route("/like").post(verify, controller.addLike);

postRouter
  .route("/comment/:comment_id")
  .patch(verify, controller.modifyComment);
postRouter.route("/unlike").patch(verify, controller.delLike);

postRouter.route("/:post_id").delete(verify, controller.delPost);
postRouter.route("/comment/:comment_id").delete(verify, controller.delComment);
postRouter
  .route("/comment/reply/:comment_id")
  .delete(verify, controller.delReply);

module.exports = postRouter;
