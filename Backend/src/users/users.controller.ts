import { bodyValidator, controller, paramsValidator } from "../decorators";
import { get, use, post, patch } from "../decorators";
import { Request, Response, NextFunction } from "express";
import { verify } from "../middleware/jwt";
import { IAuthService } from "./auth.service";
import { Inject, Service } from "typedi";
import { IUserService } from "./users.service";
import { PostAuthDto } from "./dtos/post-auth.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { GetUserDto } from "./dtos/get-user.dto";
import { UserSerializer } from "./users.serializer";

@controller("/users")
@Service()
class UsersController {
  constructor(
    @Inject("AuthService") private authService: IAuthService,
    @Inject("UserService") private userService: IUserService,
    @Inject("UserSerializer") private serializer: UserSerializer
  ) {}

  @get("/login")
  sendNonce(req: Request, res: Response) {
    res.send(this.authService.generateNonce());
  }

  @post("/login")
  @bodyValidator(PostAuthDto)
  async issueJwt(req: Request, res: Response) {
    if (!this.authService.verifySignature(req.body)) {
      res.send({ error: "Invalid signature" });
      return;
    }
    let user = await this.authService.getUser(req.body.publicAddress);

    if (!user) {
      user = await this.authService.createUser(req.body.publicAddress);
    }

    const ONEDAY = 8.64e7;
    const jwt = this.authService.generateJwt(user._id, user.role);
    res.cookie("token", jwt, {
      expires: new Date(Date.now() + ONEDAY),
      httpOnly: true,
    });
    return res.json({ token: jwt });
  }

  @post("/logout")
  @use(verify)
  invalidateJwt(req: Request, res: Response) {
    this.authService.addToBlackList(req.cookies.token, res.locals.decoded.exp);
    res.clearCookie("token").send({ result: "OK" });
  }

  @get("/")
  @use(verify)
  async sendProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(res.locals.decoded.user_id);
      if (!user) {
        throw new Error("user cannot be found");
      }
      console.log(user);
      return res.json(this.serializer.serializeUser(user));
    } catch (err) {
      console.log("유저 정보 sndProfile: User.findOne Error", err);
      next(err);
    }
  }

  @get("/posts")
  @use(verify)
  async sendUserPosts(req: Request, res: Response) {
    const result = await this.userService.getUserPosts(
      res.locals.decoded.user_id
    );

    if (!result) res.status(400).send("User cannot be found");

    return res.send(this.serializer.serializeUserPosts(result));
  }

  @get("/:user_id/posts")
  @use(verify)
  @paramsValidator(GetUserDto)
  async sendCertainUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getUserPosts(req.params.user_id);

      if (!result) res.status(400).send("User cannot be found");

      return res.send(this.serializer.serializeUserPosts(result));
    } catch (err) {
      next();
    }
  }

  @get("/comments")
  @use(verify)
  async sendUserComments(req: Request, res: Response) {
    const result = await this.userService.getUserComments(
      res.locals.decoded.user_id
    );

    if (!result) throw new Error("user cannot be updated");

    return res.send(this.serializer.serializeUserComments(result));
  }

  @get("/:user_id")
  @use(verify)
  @paramsValidator(GetUserDto)
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(req.params.user_id);

      if (!user) {
        return res.send("user cannot be found");
      }

      return res.json(this.serializer.serializeProfile(user));
    } catch (err) {
      console.log("유저 정보 sndProfile: User.findOne Error", err);
      next(err);
    }
  }

  @patch("/")
  @bodyValidator(UpdateUserDto)
  @use(verify)
  async updateUser(req: Request, res: Response) {
    const result = await this.userService.updateUser(
      res.locals.decoded.user_id,
      req.body
    );
    console.log(result);
    if (this.serializer.serializeUserUpdate(result)) {
      return res.status(400).send("user cannot be updated");
    }
    return res.send("user info updated");
  }
}
