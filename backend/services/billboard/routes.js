const express = require('express');
const controller = require('./controller');

const billboardRouter = express.Router();

billboardRouter.route('/').post(controller.personalize);

module.exports = billboardRouter;