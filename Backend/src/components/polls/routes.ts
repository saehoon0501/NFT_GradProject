import express from "express";
import pollController from "./controller";
import { verify } from "../../middleware/jwt";

const pollRouter = express.Router();

pollRouter.route("/").get(verify, pollController.getPoll);
pollRouter.route("/").post(verify, pollController.createPoll);
pollRouter.route("/:poll_id").patch(verify, pollController.votePoll);
pollRouter.route("/:poll_id").delete(verify, pollController.deletePoll);

export = pollRouter;
