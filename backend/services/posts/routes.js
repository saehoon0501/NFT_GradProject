const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const postRouter = express.Router();

postRouter.route('/').get(verify, controller.getPost);
postRouter.route('/comment/:comment_id').get(verify, controller.getComment);

postRouter.route('/').post(verify, controller.createPost);
postRouter.route('/comment/:comment_id').post(verify, controller.addComment);
postRouter.route('/comment/like/:comment_id').post(verify, controller.likeComment);
postRouter.route('/comment/reply/:comment_id').post(verify, controller.addReply);

postRouter.route('/comment/reply/like/:comment_id').put(verify, controller.likeReply);
postRouter.route('/like/:post_id').put(verify, controller.addLike);
postRouter.route('/unlike/:post_id').put(verify, controller.delLike);


module.exports = postRouter;