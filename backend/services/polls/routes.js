const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const pollRouter = express.Router();

pollRouter.route('/:poll_id').get(verify, controller.getPoll);
pollRouter.route('/').post(verify, controller.createPoll);
pollRouter.route('/comment/:comment_id').patch(verify, controller.modifyPoll);
pollRouter.route('/:post_id').delete(verify, controller.deletePoll)

module.exports = pollRouter;