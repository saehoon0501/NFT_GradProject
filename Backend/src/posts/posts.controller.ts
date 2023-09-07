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
import { PostRequestDto } from "./dtos/post-post.dto";
import { PostSerializer } from "./posts.serializer";
import { CreatePostRequestDto } from "./dtos/create-post.dto";
import { PostCommentBodyDto } from "./dtos/post-postCommentBody.dto";
import { PostCommentParamDto } from "./dtos/post-postCommentParam.dto";
import { PostReplyCommentDto } from "./dtos/post-replyComment.dto";
import { PostLikePostDto } from "./dtos/post-replyComment.dto copy";
import { Post } from "./model/PostEntity";
import { GetSearchDto } from "./dtos/get-getSearch.dto";
import { GetSendPostDto } from "./dtos/get-sendPost.dto";

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

@controller("/posts")
@Service()
class PostController {
  constructor(
    @Inject("PostService") private postService: IPostService,
    @Inject("PostSerializer") private serializer: PostSerializer
  ) {}

  @get("/")
  @queryValidator(GetSendPostDto)
  async sendPost(req: Request, res: Response, next: NextFunction) {
    try {
      const filter = req.query.filter;
      const pageNum = parseInt(req.query.pageNum as string);
      let result: Post[];

      if (filter == "best") {
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 14);
        result = await this.postService.getBestPosts(lastWeek, pageNum);
      } else if (filter === "recent") {
        result = await this.postService.getRecentPosts(pageNum);
      } else {
        return res.status(422).send("Invalid filter");
      }

      return res.send(this.serializer.serializePosts(result));
    } catch (error) {
      next(error);
    }
  }

  @post("/")
  @bodyValidator(CreatePostRequestDto)
  @use(verify)
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

      return res.send(this.serializer.serializeCreatePost(result));
    } catch (error) {
      next(error);
    }
  }

  @del("/:post_id")
  @paramsValidator(PostRequestDto)
  @use(verify)
  async delPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post_id = req.params.post_id;

      const result = await this.postService.deletePost(
        res.locals.decoded.user_id,
        post_id
      );

      return res.send(this.serializer.serializeDelete(result));
    } catch (error) {
      next(error);
    }
  }

  @get("/:post_id/comments")
  @paramsValidator(PostRequestDto)
  @use(verify)
  async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const post_id = req.params.post_id;

      const result = await this.postService.getComments(post_id);

      return res.send(this.serializer.serializePostComments(result));
    } catch (error) {
      next(error);
    }
  }

  @post("/:post_id/comments")
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostCommentParamDto)
  @use(verify)
  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const post_id = req.params.post_id;

      const post = await this.postService.getPost(post_id);
      if (!post) {
        return res.status(422).send("post does not exist");
      }

      context = this.postService.sanitize(context);

      const result = await this.postService.createPostComment(
        res.locals.decoded.user_id,
        post_id,
        context
      );

      return res.send(this.serializer.serializeCreateComment(result));
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/:comment_id")
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostReplyCommentDto)
  @use(verify)
  async addReply(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const comment_id = req.params.comment_id;
      const comment = await this.postService.getComment(comment_id);
      if (!comment) {
        return res.status(422).send("comment does not exist");
      }

      context = this.postService.sanitize(context);

      const result = await this.postService.createReplyComment(
        res.locals.decoded.user_id,
        comment_id,
        context
      );

      return res.send(this.serializer.serializeCreateComment(result));
    } catch (error) {
      next(error);
    }
  }

  @patch("/comments/:comment_id")
  @bodyValidator(PostCommentBodyDto)
  @paramsValidator(PostReplyCommentDto)
  @use(verify)
  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      let { context } = req.body;
      const comment_id = req.params.comment_id;

      context = this.postService.sanitize(context);

      const result = await this.postService.updateComment(comment_id, context);
      if (this.serializer.serializeUpdate(result)) {
        return res.status(401).send("user cannot be updated");
      }
      return res.send("updated");
    } catch (error) {
      next(error);
    }
  }

  @post("/:post_id/likes")
  @paramsValidator(PostLikePostDto)
  @use(verify)
  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.likePost(
        res.locals.decoded.user_id,
        req.params.post_id
      );

      if (this.serializer.serializeUpdate(result)) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @patch("/:post_id/likes")
  @paramsValidator(PostLikePostDto)
  @use(verify)
  async unLikePost(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);
    try {
      const result = await this.postService.unlikePost(
        res.locals.decoded.user_id,
        req.params.post_id
      );
      console.log(result);
      if (this.serializer.serializeUpdate(result)) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @post("/comments/:comment_id/likes")
  @paramsValidator(PostReplyCommentDto)
  @use(verify)
  async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.likeComment(
        res.locals.decoded.user_id,
        req.params.comment_id
      );

      if (this.serializer.serializeUpdate(result)) {
        return res.status(401).send("like cannot be updated");
      }
      return res.send("like updated");
    } catch (error) {
      next(error);
    }
  }

  @patch("/comments/:comment_id/likes")
  @paramsValidator(PostReplyCommentDto)
  @use(verify)
  async unlikeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.unlikeComment(
        res.locals.decoded.publicAddress,
        req.params.comment_id
      );

      if (this.serializer.serializeUpdate(result)) {
        return res.status(422).send("like cannot be updated");
      }

      return res.send("user info updated");
    } catch (error) {
      next(error);
    }
  }

  @get("/search")
  @queryValidator(GetSearchDto)
  @use(verify)
  async getSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.postService.getSearch(
        req.query.keyword as string
      );

      console.log(result);
      return res.send(this.serializer.serializeSearch(result));
    } catch (error) {
      next(error);
    }
  }
}
