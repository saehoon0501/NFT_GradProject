const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const postRouter = express.Router();

postRouter.route('/').get(verify, controller.getPost);
postRouter.route('/').post(verify, controller.upload.single('file'), controller.createPost);

module.exports = postRouter;