import express from "express";
import controller from "./controller";
import { verify } from "../../middleware/jwt";

const userRouter = express.Router();

userRouter.route("").get(verify, controller.getProfile);
userRouter.route("/post").get(verify, controller.getUserPost);
userRouter.route("/comment").get(verify, controller.getUserComment);
userRouter.route("/").patch(verify, controller.updateProfile);

export = userRouter;
