const express = require('express');
const controller = require('./controller');
const verify = require('../../middleware/jwt');

const pollRouter = express.Router();

pollRouter.route('/').get(verify, controller.getPoll);
pollRouter.route('/').post(verify, controller.createPoll);
pollRouter.route('/:poll_id').patch(verify, controller.votePoll);
pollRouter.route('/:poll_id').delete(verify, controller.deletePoll)

module.exports = pollRouter;