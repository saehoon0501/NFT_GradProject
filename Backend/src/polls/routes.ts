import express from "express";
import pollController from "./controller";

const pollRouter = express.Router();

pollRouter.route("/").get(pollController.getPoll);
pollRouter.route("/").post(pollController.createPoll);
pollRouter.route("/:poll_id").patch(pollController.votePoll);
pollRouter.route("/:poll_id").delete(pollController.deletePoll);

export = pollRouter;
