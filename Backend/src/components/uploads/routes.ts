import express from "express";
import controller from "./controller";

const uploadRouter = express.Router();

uploadRouter
  .route("/")
  .post(controller.upload.single("file"), controller.returnURL);

export = uploadRouter;
