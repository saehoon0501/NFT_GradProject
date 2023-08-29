import mongoose from "mongoose";
import postService from "./service";
import userService from "../users/service";

const QuillDeltaToHtmlConverter =
  require("quill-delta-to-html").QuillDeltaToHtmlConverter;

class postController {
  public static getPost = async (req, res, next) => {
    try {
      const filter = req.query.filter;
      let pageNum = parseInt(req.query.pageNum);
      let result;

      if (req.query.pageNum == undefined) {
        pageNum = 0;
      }
      if (filter == "best") {
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 14);
        result = await postService.getBestPosts(lastWeek, pageNum);
      } else {
        result = await postService.getPosts(pageNum);
      }

      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public static createPost = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      let { post_title, post_text } = req.body;

      const converter = new QuillDeltaToHtmlConverter(post_text.ops, {});
      const content = converter.convert();

      if (post_title == undefined || !/([^\s])/.test(post_title)) {
        return res.status(400).send("Need title");
      }
      post_title = post_title.replace(/^\s+/g, "");
      post_title = post_title.replace(/\s+$/g, "");

      const user = await userService.getUserByAddress(publicAddress);

      if (!user) {
        throw new Error("User Not Found");
      }

      const like = await postService.createLike();
      const post = await postService.createPost({
        user: user.id,
        title: post_title,
        text: content,
        likes: like,
      });

      return res.send({
        _id: post.id,
        user: user,
        title: post.title,
        text: post.text,
        likes: like,
        comments: [],
        createdAt: post.createdAt,
      });
    } catch (err) {
      next(err);
    }
  };

  public static delPost = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      const post_id = req.params.post_id;
      const user = await userService.getUserByAddress(publicAddress);

      if (user.profile.post_ids.includes(post_id) || user.role == "admin") {
        const post = await postService.findPost(post_id);

        if (!post) {
          throw new Error("Post Not Found");
        }

        const result = await postService.deletePost(post_id, post, user);

        if (!result) {
          throw new Error("Post deletion Stopped");
        }

        return res.send("Post Deleted");
      }
      return res.send("Post Not Deleted");
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public static likePost = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      const { likes } = req.body;

      const user = await userService.getUserByAddress(publicAddress);

      if (!user) {
        throw new Error("User Not Found");
      }

      const like = await postService.getLike(likes._id);

      if (!like) {
        throw new Error("Like Not Found");
      }

      if (!like.liked_user.includes(user.id)) {
        like.liked_num += 1;
        like.liked_user.addToSet(user.id);
        await like.save();
      }

      return res.send(like);
    } catch (error) {
      next(error);
    }
  };

  public static delLike = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      const { likes } = req.body;
      const user = await userService.getUserByAddress(publicAddress);

      if (!user) {
        throw new Error("User Not Found");
      }

      let like = await postService.getLike(likes._id);

      if (!like) {
        throw new Error("Like Not Found");
      }

      if (like.liked_user.includes(user.id)) {
        like.liked_num -= 1;
        like.liked_user.pull(user.id);
      }
      like.save((err, data) => {
        if (err) throw new Error("Like Not Found");
        console.log(data);
        return res.send(like);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };

  public static getComment = async (req, res, next) => {
    try {
      const post_id = req.params.post_id;
      const result = await postService.getComments(post_id);

      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public static addComment = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      let { context } = req.body;
      const post_id = req.params.post_id;

      if (!context == undefined || !/([^\s])/.test(context)) {
        throw new Error("Need any character");
      }

      context = context.replace(/^\s+/g, "");
      context = context.replace(/\s+$/g, "");

      const user = await userService.getUserByAddress(publicAddress);

      if (!user) {
        throw new Error("User Not Found");
      }
      await postService.updateComment(
        {
          user: user._id,
          caption: context,
          replies: [],
        },
        publicAddress,
        post_id
      );

      return res.send("Success");
    } catch (error) {
      next(error);
    }
  };

  public static likeComment = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      const comment_id = req.params.comment_id;
      const user = await userService.getUserByAddress(publicAddress);

      if (!user) {
        throw new Error("User Not Found");
      }

      const comment = await postService.getCommentById(comment_id);
      if (!comment) {
        throw new Error("Comment Not Found");
      }

      comment.liked_user.addToSet(user.id);
      const result = await comment.save();
      console.log(result);
      return res.send(comment.liked_user);
    } catch (error) {
      next(error);
    }
  };

  public static modifyComment = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      let { context } = req.body;
      const comment_id = req.params.comment_id;

      if (!context == undefined || !/([^\s])/.test(context)) {
        throw new Error("Need any character");
      }

      context = context.replace(/^\s+/g, "");
      context = context.replace(/\s+$/g, "");

      const user = await userService.getUserByAddress(publicAddress);
      let comment = await postService.getCommentById(comment_id);
      console.log(comment);
      if (!user) {
        throw new Error("User Not Found");
      }
      if (!comment) {
        throw new Error("Comment Not Found");
      }
      console.log(comment);
      if (user.id == String(comment.user)) {
        if (comment.caption == "삭제된 내용입니다.")
          throw new Error("Deleted comment");
        comment.caption = context;
        comment.save().then(async () => {
          return res.send("comment modified");
        });
      } else {
        throw new Error("not a writer of comment");
      }
    } catch (error) {
      next(error);
    }
  };

  public static delComment = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      const { post_id } = req.body;
      const comment_id = req.params.comment_id;

      if (post_id === undefined || comment_id === undefined) {
        throw new Error("Post_id or Comment_id is missing");
      }

      const user = await userService.getUserByAddress(publicAddress);
      let comment = await postService.getCommentById(comment_id);
      let post = await postService.getPostById(post_id);

      await postService.deleteComment(user, comment, post);
      return res.send("message deleted");
    } catch (err) {
      next(err);
    }
  };

  public static addReply = async (req, res, next) => {
    try {
      const publicAddress = res.locals.decoded.publicAddress;
      let { context } = req.body;
      const comment_id = req.params.comment_id;

      if (context == undefined || !/([^\s])/.test(context)) {
        throw new Error("Need any character");
      }

      context = context.replace(/^\s+/g, "");
      context = context.replace(/\s+$/g, "");

      let user = await userService.getUserByAddress(publicAddress);
      let comment = await postService.getCommentById(comment_id);

      if (comment == null || user == null)
        throw new Error("comment or user not found");

      await postService.addReply(user, comment, context);

      return res.send("Success");
    } catch (err) {
      next(err);
    }
  };

  public static delReply = async (req, res, next) => {
    const publicAddress = res.locals.decoded.publicAddress;
    const { reply_id } = req.body;
    const comment_id = req.params.comment_id;

    try {
      const user = await userService.getUserByAddress(publicAddress);
      let reply = await postService.getCommentById(reply_id);
      let comment = await postService.getCommentById(comment_id);

      if (!user || !reply || !comment) throw new Error("Something Not Found");

      const result = await postService.deleteReply(user, reply, comment);

      if (!result) {
        throw new Error("Reply Deletion Failed");
      }

      return res.send("reply deleted");
    } catch (error) {
      next(error);
    }
  };

  public static getSearch = async (req, res, next) => {
    const keyword = req.query.keyword;

    try {
      if (keyword == null || keyword.length < 2)
        throw new Error("Keyword should be at least have 2 characters");

      let result = await postService.getSearch(keyword);

      if (!result) {
        throw new Error("Search Not Found");
      }

      return res.send(result);
    } catch (error) {
      console.log("Search Error", error);
      return res.status(400).send(error);
    }
  };
}

export default postController;
