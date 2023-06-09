import express = require("express");
import controller = require("./controller");
import verify = require("../../middleware/jwt");

const userRouter = express.Router();

userRouter.route("").get(verify, controller.getProfile);
userRouter.route("/posts").get(verify, controller.getUserPost);
userRouter.route("/comments").get(verify, controller.getUserComment);
userRouter.route("/").patch(verify, controller.updateProfile);

module.exports = userRouter;
