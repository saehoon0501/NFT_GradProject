import express = require("express");
import controller = require("./controller");

const authRouter = express.Router();

authRouter.route("/").post(controller.sndJwt);
authRouter.route("/").get(controller.sndNonce);

module.exports = authRouter;
