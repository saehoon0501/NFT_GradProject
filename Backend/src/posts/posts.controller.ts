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
import { PostCommentBodyDto } from "./dtos/post-postCommentBody.dto";
import { PostCommentParamDto } from "./dtos/post-postCommentParam.dto";
import { PostReplyCommentDto } from "./dtos/post-replyComment.dto";
import { PostLikePostDto } from "./dtos/post-replyComment.dto copy";
import { Post } from "./model/PostEntity";
import { GetSearchDto } from "./dtos/get-getSearch.dto";
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
      let result: Post[];

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
      const result = await this.postService.createPost({
        user: res.locals.decoded.user_id,
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

      return res.send(result);
    } catch (error) {
      next(error);
    }
  }

  @post("/:post_id/comments")
  @use(verify)
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostCommentParamDto)
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const post_id = req.params.post_id;

      context = this.postService.sanitize(context);

      const result = await this.postService.createPostComment(
        res.locals.decoded.user_id,
        post_id,
        context
      );

      return res.send(result);
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/:comment_id")
  @use(verify)
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostReplyCommentDto)
  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const comment_id = req.params.comment_id;

      context = this.postService.sanitize(context);

      const result = await this.postService.createReplyComment(
        res.locals.decoded.user_id,
        comment_id,
        context
      );

      return res.send(result);
    } catch (error) {
      next(error);
    }
  }

  @patch("/comments/:comment_id")
  @use(verify)
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostReplyCommentDto)
  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const comment_id = req.params.comment_id;

      context = this.postService.sanitize(context);

      const result = await this.postService.updateComment(comment_id, context);
      if (result.matchedCount === 0) {
        return res.status(401).send("user cannot be updated");
      }
      return res.send("comment updated");
    } catch (error) {
      next(error);
    }
  }

  @post("/:post_id/likes")
  @use(verify)
  @paramsValidator(PostLikePostDto)
  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.likePost(
        res.locals.decoded.user_id,
        req.params.post_id
      );

      if (result.matchedCount === 0) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @patch("/:post_id/likes")
  @use(verify)
  @paramsValidator(PostLikePostDto)
  async unLikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.unlikePost(
        res.locals.decoded.user_id,
        req.params.post_id
      );

      if (result.matchedCount === 0) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/:comment_id/likes")
  @use(verify)
  @paramsValidator(PostReplyCommentDto)
  async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.likeComment(
        res.locals.decoded.user_id,
        req.params.comment_id
      );

      if (result.matchedCount === 0) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @patch("/comments/:comment_id/likes")
  @use(verify)
  @paramsValidator(PostReplyCommentDto)
  async unlikeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.unlikeComment(
        res.locals.decoded.publicAddress,
        req.params.comment_id
      );

      if (result.matchedCount === 0) {
        return res.status(401).send("like cannot be updated");
      }

      return res.send("user info updated");
    } catch (error) {
      next(error);
    }
  }

  @get("/search")
  @use(verify)
  @queryValidator(GetSearchDto)
  async getSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.getSearch(
        req.query.keyword as string
      );

      if (!result) {
        return res.status(401).send("Not Found");
      }

      return res.send(result);
    } catch (error) {
      next(error);
    }
  }
}
