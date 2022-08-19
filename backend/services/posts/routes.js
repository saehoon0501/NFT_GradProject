const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const postRouter = express.Router();

postRouter.route('/').get(verify, controller.getPost);
postRouter.route('/').post(verify, controller.createPost);
postRouter.route('/like/:post_id').put(verify, controller.addLike);
postRouter.route('/unlike/:post_id').put(verify, controller.delLike);

module.exports = postRouter;