import express from "express";
import controller from "./controller";

const authRouter = express.Router();

authRouter.route("/").post(controller.sndJwt);
authRouter.route("/").get(controller.sndNonce);

export = authRouter;
