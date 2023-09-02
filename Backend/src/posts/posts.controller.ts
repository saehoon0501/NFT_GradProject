import {
  controller,
  get,
  post,
  del,
  use,
  patch,
  queryValidator,
  paramsValidator,
  bodyValidator,
} from "../decorators";
import { Request, Response, NextFunction } from "express";
import { IPostService } from "./posts.service";
import { Service, Inject } from "typedi";
import { IUserService } from "../users/users.service";
import { verify } from "../middleware/jwt";
import { PostRequestDto } from "./dtos/post.dto";
import { CreatePostRequestDto } from "./dtos/create-post.dto";
const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

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
      return res.send(result);
    } catch (error) {
      next(error);
    }
  }
  @post("/")
  @use(verify)
  @bodyValidator(CreatePostRequestDto)
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
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
        text: content,
      });

      return res.send(result);
    } catch (error) {
      next(error);
    }
  }

  @del("/:post_id")
  @use(verify)
  @paramsValidator(PostRequestDto)
  async delPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post_id = req.params.post_id;

      const user = await this.userService.getUser(
        res.locals.decoded.publicAddress
      );

      const result = await this.postService.deletePost(post_id);
      console.log(result);
      if (result.deletedCount === 0) {
        return res.status(500).send("post deletion failed");
      }

      return res.send("post deleted");
    } catch (error) {
      next(error);
    }
  }

  @get("/:post_id/comments")
  @use(verify)
  @paramsValidator(PostRequestDto)
  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const post_id = req.params.post_id;
      if (post_id === undefined) {
        return res.status(422).send("post_id is needed");
      }

      const result = await this.postService.getComments(post_id);
    } catch (error) {
      next(error);
    }
  }

  @post("/:post_id/comments")
  @use(verify)
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/:comment_id")
  @use(verify)
  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @patch("/comments/:comment_id")
  @use(verify)
  async modifyComment(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/likes")
  @use(verify)
  async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @post("/likes")
  @use(verify)
  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @patch("/likes")
  @use(verify)
  async delLike(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @del("/comments/:comment_id")
  @use(verify)
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  @get("/search")
  @use(verify)
  async getSearch(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}
