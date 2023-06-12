import { HydratedDocument } from "mongoose";
import { PollModel, Poll } from "./model";

class pollService {
  public static getAllPoll = (): Promise<HydratedDocument<Poll>[]> => {
    return PollModel.find();
  };

  public static getPollById = (
    poll_id: string
  ): Promise<HydratedDocument<Poll>> => {
    return PollModel.findById(poll_id);
  };

  public static createPoll = (title: string, ObjectOptions) => {
    return new PollModel({
      title: title,
      options: ObjectOptions,
      votes: [],
    });
  };

  public static deletePoll = (poll_id: string): Promise<any> => {
    return PollModel.deleteOne({ id: poll_id });
  };
}

export default pollService;
