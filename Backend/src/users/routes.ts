import express from "express";
import controller from "./controller";

const userRouter = express.Router();

userRouter.route("").get(controller.getProfile);
userRouter.route("/post").get(controller.getUserPost);
userRouter.route("/comment").get(controller.getUserComment);
userRouter.route("/").patch(controller.updateProfile);

export = userRouter;
