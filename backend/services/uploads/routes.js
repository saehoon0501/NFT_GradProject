const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const uploadRouter = express.Router();

uploadRouter.route('/').post(verify, controller.upload.single('file'), controller.returnURL);

module.exports = uploadRouter;