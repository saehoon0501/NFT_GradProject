import { controller } from "../decorators";
import { get, use } from "../decorators";
import { Request, Response, NextFunction } from "express";
import { verify } from "../middleware/jwt";
import userService from "./service";

@controller("/users")
class UsersController {
  @get("/")
  @use(verify)
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserByAddress(
        res.locals.decoded.publicAddress
      );

      if (!user) {
        throw new Error("user cannot be found");
      }

      return res.json(user);
    } catch (err) {
      console.log("유저 정보 sndProfile: User.findOne Error", err);
      next(err);
    }
  }
}
