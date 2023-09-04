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
import { UserDto } from "./dtos/user.dto";
import { ProfileDto } from "./dtos/profile.dto";
import { PostDto } from "./dtos/posts.dto";
import { CommentDto } from "./dtos/comments.dto";

@controller("/users")
@Service()
class UsersController {
  constructor(
    @Inject("AuthService") private authService: IAuthService,
    @Inject("UserService") private userService: IUserService,
    @Inject("UserSerializer") private serializer: UserSerializer
  ) {}

  @get("/auth")
  sendNonce(req: Request, res: Response) {
    res.send(this.authService.generateNonce());
  }

  @post("/auth")
  @bodyValidator(PostAuthDto)
  async sendJwt(req: Request, res: Response) {
    const result = await this.authService.verifySignature(req.body);

    if (!result) {
      res.send({ error: "Invalid signature" });
      return;
    }

    const jwt = this.authService.generateJwt(result._id);

    return res.send(jwt);
  }

  @get("/")
  @use(verify)
  async sendProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUser(res.locals.decoded.user_id);
      if (!user) {
        throw new Error("user cannot be found");
      }

      return res.json(this.serializer.serializeUser(UserDto, user));
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
    console.log(result[0].posts);
    return res.send(this.serializer.serializeUserItems(PostDto, result));
  }

  @get("/comments")
  @use(verify)
  async sendUserComments(req: Request, res: Response) {
    const result = await this.userService.getUserComments(
      res.locals.decoded.user_id
    );

    if (!result) throw new Error("user cannot be updated");

    return res.send(this.serializer.serializeUserItems(CommentDto, result));
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

      return res.json(this.serializer.serializeUser(ProfileDto, user));
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

    if (this.serializer.serializeUserUpdate(result)) {
      return res.status(400).send("user cannot be updated");
    }
    return res.send("user info updated");
  }
}
