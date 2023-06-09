import express = require("express");
import controller = require("./controller");
import verify = require("../../middleware/jwt");

const uploadRouter = express.Router();

uploadRouter
  .route("/")
  .post(verify, controller.upload.single("file"), controller.returnURL);

module.exports = uploadRouter;
