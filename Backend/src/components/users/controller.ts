import userService from "./service";
import { User, UserModel } from "./model";

class userController {
  public static getProfile = async (req, res, next) => {
    try {
      let user: User;

      if (req.query.userId == undefined) {
        const publicAddress = res.locals.decoded.publicAddress;
        user = await userService.getUserByAddress(publicAddress);
      } else {
        const publicAddress: string = req.query.userId.toLowerCase();
        user = await userService.getUserByAddress(publicAddress);
      }

      if (!user) {
        throw new Error("user cannot be found");
      }

      return res.json(user);
    } catch (err) {
      console.log("유저 정보 sndProfile: User.findOne Error", err);
      next(err);
    }
  };

  public static updateProfile = async (req, res, next) => {
    try {
      let result;
      const publicAddress = res.locals.decoded.publicAddress;
      const { caption, profileName, profile_pic } = req.body;

      if (caption || profileName) {
        result = await userService.updateUserDescription(
          publicAddress,
          caption,
          profileName
        );
      }

      if (profile_pic) {
        result = await userService.updateUserPic(publicAddress, profile_pic);
      }

      if (result.matchedCount == 0) {
        throw new Error("user cannot be updated");
      }

      return res.send("user info updated");
    } catch (err) {
      console.log("updateProfile: User.findOneandUpdate Error", err);
      next(err);
    }
  };

  public static getUserPost = async (req, res, next) => {
    try {
      let result;
      const publicAddress = res.locals.decoded.publicAddress;

      result = await userService.getUserPost(publicAddress);

      if (!result) throw new Error("user cannot be found");

      return res.send(result);
    } catch (err) {
      console.log("getUerPost: User.aggregate error", err);
      return res.status(400).send(err);
    }
  };

  public static getUserComment = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      let result = await userService.getUserComment(publicAddress);

      if (!result) throw new Error("user cannot be updated");

      return res.send(result[0]);
    } catch (err) {
      console.log("getUserComment: User.aggregate error", err);
      return res.status(400).send(err);
    }
  };
}

export default userController;
