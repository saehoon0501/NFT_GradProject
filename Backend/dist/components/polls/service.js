"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
class pollService {
}
pollService.getAllPoll = () => {
    return model_1.PollModel.find();
};
pollService.getPollById = (poll_id) => {
    return model_1.PollModel.findById(poll_id);
};
pollService.createPoll = (title, ObjectOptions) => {
    return new model_1.PollModel({
        title: title,
        options: ObjectOptions,
        votes: [],
    });
};
pollService.deletePoll = (poll_id) => {
    return model_1.PollModel.deleteOne({ id: poll_id });
};
exports.default = pollService;
