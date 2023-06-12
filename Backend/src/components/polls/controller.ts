import { HydratedDocument, Schema } from "mongoose";
import pollService from "./service";
import { Poll } from "./model";
import userService from "../users/service";

class pollController {
  public static getPoll = async (req, res, next) => {
    try {
      const poll_id = req.query.poll_id;

      let poll: HydratedDocument<Poll> | HydratedDocument<Poll>[];
      if (poll_id === undefined) {
        poll = await pollService.getAllPoll();
      } else {
        poll = await pollService.getPollById(poll_id);

        if (!poll) throw new Error("Poll not found");
      }
      return res.send(poll);
    } catch (err) {
      console.log("getPoll: Poll.findById error", err);
      next(err);
    }
  };

  public static createPoll = async (req, res, next) => {
    try {
      const { title, options } = req.body;
      const publicAddress = res.locals.decoded.publicAddress;

      if (!title || !options) throw new Error("Need title, options");

      const user = await userService.getUserByAddress(publicAddress);

      if (!user || user.role != "admin") throw new Error("Non-Authorized User");

      let ObjectOptions: { name: string; vote_count: number }[] = [];

      options.map((option): void => {
        ObjectOptions.push({ name: option, vote_count: 0 });
      });

      //create new poll data
      const newPoll = pollService.createPoll(title, ObjectOptions);

      const result = await newPoll.save();
      if (result.acknowleged == false) {
        throw new Error("Poll Not Created");
      }
      return res.send(result);
    } catch (err) {
      next(err);
    }
  };

  public static deletePoll = async (req, res, next) => {
    try {
      const poll_id = req.params.poll_id;
      const publicAddress = res.locals.decoded.publicAddress;
      console.log(poll_id);

      const user = await userService.getUserByAddress(publicAddress);

      if (!user || user.role != "admin") {
        throw new Error("Not Authorized");
      }

      const result = await pollService.deletePoll("poll_id");

      return res.send(result);
    } catch (err) {
      console.log("getPoll: Poll.deleteOne error", err);
      next(err);
    }
  };

  public static votePoll = async (req, res, next) => {
    try {
      const poll_id = req.params.poll_id;
      const { voted_item, user_id, usedNFT } = req.body;

      if (!poll_id) throw new Error("No poll id");
      if (!user_id || !usedNFT || !usedNFT.collection_id || !usedNFT.NFT_URL)
        throw new Error("Parameter missing");
      if (!voted_item && voted_item != 0) throw new Error("Parameter missing");

      const user = await userService.getUserByID(user_id);

      if (!user) throw new Error("User Not Found");

      let owner = false;
      for (const collection of user.ownerOfNFT) {
        if (collection.collection_id === usedNFT.collection_id) {
          for (const nft of collection.NFT_URL) {
            if (nft === usedNFT.NFT_URL) {
              console.log("nft", nft, usedNFT.NFT_URL);
              owner = true;
              break;
            }
          }
          if (owner) break;
        }
      }
      if (!owner) throw new Error("Not The Owner");

      const poll = await pollService.getPollById(poll_id);

      if (!poll) throw new Error("Poll Not Found");

      let check = false;
      poll.votes.map((vote) => {
        if (vote.usedNFT.NFT_URL == usedNFT.NFT_URL) {
          check = true;
          return;
        }
      });

      if (check) throw new Error("NFT Already Used For This Poll");
      if (voted_item >= poll.options.length || voted_item < 0)
        throw new Error("Invalid Option");

      poll.votes.push({ user_id, usedNFT });
      poll.options[voted_item].vote_count += 1;
      const result = await poll.save();

      if (!result) throw new Error("Voting Stopped");

      return res.send(result);
    } catch (err) {
      console.log("votePoll: Poll.findById error", err);
      next(err);
    }
  };
}

export default pollController;
