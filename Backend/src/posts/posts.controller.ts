import {
  controller,
  get,
  post,
  del,
  use,
  bodyValidator,
  patch,
} from "../decorators";
import { Request, Response, NextFunction } from "express";
import { IPostService } from "./posts.service";
import { Service, Inject } from "typedi";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { IUserService } from "../users/users.service";
import { verify } from "../middleware/jwt";

@controller("/posts")
@Service()
class PostController {
  constructor(
    @Inject("PostService") private postService: IPostService,
    @Inject("UserService") private userService: IUserService
  ) {}

  @get("/")
  async sendPost(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = req.query.filter;
      let pageNum: number;
      let result;

      if (req.query.pageNum == undefined) {
        pageNum = 0;
      } else {
        pageNum = parseInt(req.query.pageNum as string);
      }
      if (filter == "best") {
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 14);
        result = await this.postService.getBestPosts(lastWeek, pageNum);
      } else {
        result = await this.postService.getPosts(pageNum);
      }
      console.log(result);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  }
  @post("/")
  @use(verify)
  @bodyValidator("post_title", "post_text")
  async createPost(req: Request, res: Response, next: NextFunction) {
    let { post_title, post_text } = req.body;
    const converter = new QuillDeltaToHtmlConverter(post_text.ops, {});

    const content = converter.convert();
    const title = this.postService.sanitize(post_title);

    const user = await this.userService.getUser(
      res.locals.decoded.publicAddress
    );

    if (!user) {
      return res.status(401).send("User not found");
    }

    const result = await this.postService.createPost({
      user: user._id,
      title,
      content,
    });

    return res.send(result);
  }

  @del("/:post_id")
  @use(verify)
  async delPost(req: Request, res: Response, next: NextFunction) {}

  @get("/:post_id/comments")
  @use(verify)
  async getComments(req: Request, res: Response, next: NextFunction) {}

  @post("/:post_id/comments")
  @use(verify)
  async addComment(req: Request, res: Response, next: NextFunction) {}

  @post("/comments/:comment_id")
  @use(verify)
  async addReply(req: Request, res: Response, next: NextFunction) {}

  @patch("/comments/:comment_id")
  @use(verify)
  async modifyComment(req: Request, res: Response, next: NextFunction) {}

  @post("/comments/likes")
  @use(verify)
  async likeComment(req: Request, res: Response, next: NextFunction) {}

  @post("/likes")
  @use(verify)
  async likePost(req: Request, res: Response, next: NextFunction) {}

  @patch("/likes")
  @use(verify)
  async delLike(req: Request, res: Response, next: NextFunction) {}

  @del("/comments/:comment_id")
  @use(verify)
  async deleteComment(req: Request, res: Response, next: NextFunction) {}

  @get("/search")
  @use(verify)
  async getSearch(req: Request, res: Response, next: NextFunction) {}
}
