const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const userRouter = express.Router();

userRouter.route('/').get(verify, controller.sndProfile);
userRouter.route('/').patch(verify, controller.updateProfile);

module.exports = userRouter;