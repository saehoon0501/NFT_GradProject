import { controller, get, post, del, use, bodyValidator } from "../decorators";
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

    const post = await this.postService.createPost({
      user: user._id,
      title,
      content,
    });

    return res.send(post);
  }

  // @del("/:post_id")
}
