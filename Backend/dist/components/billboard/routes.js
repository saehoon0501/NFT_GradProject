"use strict";
const express = require("express");
const controller = require("./controller");
const verify = require("../../../middleware/jwt");
const billboardRouter = express.Router();
billboardRouter.route("/").post(verify, controller.personalize);
module.exports = billboardRouter;
