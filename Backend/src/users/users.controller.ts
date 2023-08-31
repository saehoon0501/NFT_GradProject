import { bodyValidator, controller } from "../decorators";
import { get, use, post, patch } from "../decorators";
import { Request, Response, NextFunction } from "express";
import { verify } from "../middleware/jwt";
import { IAuthService } from "./auth.service";
import { Inject, Service } from "typedi";
import { IUserService } from "./users.service";

@controller("/users")
@Service()
class UsersController {
  constructor(
    @Inject("AuthService") private authService: IAuthService,
    @Inject("UserService") private userService: IUserService
  ) {}

  @get("/auth")
  sendNonce(req: Request, res: Response) {
    res.send(this.authService.generateNonce());
  }

  @post("/auth")
  @bodyValidator("publicAddress", "signature", "msg")
  async sendJwt(req: Request, res: Response) {
    console.log("post: /auth", req.body);
    const result = await this.authService.verifySignature(req.body);

    if (!result) {
      res.send({ error: "Invalid signature" });
    }

    const jwt = this.authService.generateJwt(req.body.publicAddress);

    res.send(jwt);
  }

  @get("/")
  @use(verify)
  async sendProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(
        res.locals.decoded.publicAddress
      );
      // console.log(user);
      if (!user) {
        throw new Error("user cannot be found");
      }

      return res.json(user);
    } catch (err) {
      console.log("유저 정보 sndProfile: User.findOne Error", err);
      next(err);
    }
  }

  @get("/posts")
  @use(verify)
  async sendUserPosts(req: Request, res: Response) {
    const result = await this.userService.getUserPosts(
      res.locals.decoded.publicAddress
    );

    if (!result) res.status(400).send("User cannot be found");
    // console.log("/users/posts", result);
    res.send(result);
  }

  @get("/comments")
  @use(verify)
  async sendUserComments(req: Request, res: Response) {
    const result = await this.userService.getUserComments(
      res.locals.decoded.publicAddress
    );

    if (!result) throw new Error("user cannot be updated");

    return res.send(result[0]);
  }

  @patch("/")
  @bodyValidator("caption", "profileName", "profile_pic")
  @use(verify)
  async updateUser(req: Request, res: Response) {
    console.log("updating User", req.body);
    const result = await this.userService.updateUser(
      res.locals.decoded.publicAddress,
      req.body
    );
    console.log(result);
    if (result.matchedCount == 0) {
      return res.status(400).send("user cannot be updated");
    }
    return res.send("user info updated");
  }
}
