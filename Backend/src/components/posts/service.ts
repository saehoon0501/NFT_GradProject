import {
  PostModel,
  LikeModel,
  CommentModel,
  Post,
  Comment,
  Like,
} from "./model";
import { User, UserModel } from "../users/model";
import { Types, HydratedDocument } from "mongoose";
import { io } from "../../socket";

class postService {
  public static getBestPosts = (lastWeek: Date, pageNum: number) => {
    return PostModel.aggregate([
      { $match: { createdAt: { $gt: lastWeek } } },
      {
        $lookup: {
          from: LikeModel.collection.name,
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
      { $sort: { "likes.liked_num": -1 } },
      { $skip: pageNum * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          "user._id": 1,
          "user.publicAddr": 1,
          "user.profile.profile_pic": 1,
          "user.profile.username": 1,
          "user.profile.caption": 1,
          "user.profile.points": 1,
          title: 1,
          text: 1,
          likes: 1,
          "comments._id": 1,
          createdAt: 1,
        },
      },
      { $unwind: "$user" },
    ]).exec();
  };

  public static getPosts = (pageNum: number) => {
    return PostModel.aggregate([
      { $sort: { _id: -1 } },
      { $skip: pageNum * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: LikeModel.collection.name,
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $project: {
          _id: 1,
          "user._id": 1,
          "user.publicAddr": 1,
          "user.profile.profile_pic": 1,
          "user.profile.username": 1,
          "user.profile.caption": 1,
          "user.profile.points": 1,
          title: 1,
          text: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
        },
      },
      { $unwind: "$user" },
      { $unwind: "$likes" },
    ]).exec();
  };

  public static createLike = () => {
    const like: HydratedDocument<Comment> = new LikeModel({});
    return like.save();
  };

  public static createPost = ({ user, title, text, likes }) => {
    const post: HydratedDocument<Post> = new PostModel({
      user,
      title,
      text,
      likes,
    });
    return post.save();
  };

  public static findPost = (post_id) => {
    return PostModel.findById(post_id).lean();
  };

  public static deletePost = (
    post_id: string,
    post: Post,
    user: HydratedDocument<User>
  ) => {
    user.profile.post_ids.pull(post_id);

    return Promise.all([
      PostModel.deleteOne({ _id: post_id }),
      LikeModel.deleteOne({ _id: post.likes }),
      user.save(),
      post.comments.map((comment_id) => {
        CommentModel.findById(comment_id).then(
          async (comment: HydratedDocument<Comment> | undefined) => {
            if (!comment) {
              return;
            } else if (comment.replies.length > 0) {
              comment.replies.map(
                async (reply_id) =>
                  await CommentModel.deleteOne({ _id: reply_id })
              );
            }
            await CommentModel.deleteOne({ _id: comment_id });
          }
        );
      }),
    ]);
  };

  public static getLike = (like_id): Promise<HydratedDocument<Like>> => {
    return LikeModel.findById(like_id);
  };

  public static getComments = (post_id) => {
    return PostModel.aggregate([
      { $match: { _id: new Types.ObjectId(post_id) } },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      { $unwind: "$comments" },
      { $project: { comments: 1 } },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "comments.user",
          foreignField: "_id",
          as: "comments.user",
        },
      },
      { $unwind: "$comments.user" },
      {
        $project: {
          "comments._id": 1,
          "comments.user._id": 1,
          "comments.user.profile.username": 1,
          "comments.user.profile.caption": 1,
          "comments.user.profile.profile_pic": 1,
          "comments.caption": 1,
          "comments.liked_user": 1,
          "comments.replies": 1,
          "comments.updatedAt": 1,
          "comments.__v": 1,
        },
      },
      {
        $lookup: {
          from: CommentModel.collection.name,
          localField: "comments.replies",
          foreignField: "_id",
          as: "comments.replies",
        },
      },
      {
        $unwind: {
          path: "$comments.replies",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "comments.replies.user",
          foreignField: "_id",
          as: "comments.replies.user",
        },
      },
      {
        $unwind: {
          path: "$comments.replies.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "comments.replies.user.publicAddr": 0,
          "comments.replies.user.ownerOfNFT": 0,
          "comments.replies.user.profile.post_ids": 0,
          "comments.replies.user.profile.comment_ids": 0,
          "comments.replies.user.profile.points": 0,
          "comments.replies.user.profile.liked_user": 0,
          "comments.replies.user.__v": 0,
          "comments.replies.replies": 0,
          "comments.replies.createdAt": 0,
        },
      },
      {
        $group: {
          _id: "$comments._id",
          user: { $first: "$comments.user" },
          caption: { $first: "$comments.caption" },
          liked_user: { $first: "$comments.liked_user" },
          updatedAt: { $first: "$comments.updatedAt" },
          replies: { $push: "$comments.replies" },
          __v: { $first: "$comments.__v" },
        },
      },
    ]).sort({ updatedAt: 1 });
  };

  public static updateComment = (
    { user, caption, replies },
    publicAddress,
    post_id
  ) => {
    const comment = new CommentModel({ user, caption, replies });

    return Promise.all([
      UserModel.updateOne(
        { publicAddr: publicAddress },
        { $addToSet: { "profile.comment_ids": comment._id } }
      ),
      PostModel.updateOne(
        { _id: post_id },
        { $addToSet: { comments: comment._id } }
      ),
      comment.save(),
    ]).then(() => {
      io.of("/comment").to(post_id).emit("getNotification", `commentAdded`);
    });
  };

  public static getCommentById = (
    comment_id: string
  ): Promise<HydratedDocument<Comment>> => {
    return CommentModel.findById(comment_id);
  };

  public static deleteComment = async (
    user: HydratedDocument<User>,
    comment: HydratedDocument<Comment>,
    post: HydratedDocument<Post>
  ) => {
    try {
      if (String(user._id) === String(comment.user)) {
        if (comment.replies.length <= 0) {
          post.comments.pull(String(comment._id));
          await CommentModel.deleteOne({ _id: String(comment._id) });
        } else {
          comment.caption = "삭제된 내용입니다.";
          await comment.save();
        }
        user.profile.comment_ids.pull(String(comment._id));
        return Promise.all([user.save(), post.save()]);
      }
    } catch (err) {
      throw new Error("Comment Deletion Failed");
    }
  };

  public static getPostById = (post_id): Promise<HydratedDocument<Post>> => {
    return PostModel.findById(post_id);
  };

  public static deleteReply = async (
    user: HydratedDocument<User>,
    reply: HydratedDocument<Comment>,
    comment: HydratedDocument<Comment>
  ) => {
    let isInArray = comment.replies.some((replyItem) => {
      return String(replyItem) === String(reply._id);
    });

    if (String(user._id) === String(reply.user) && isInArray) {
      reply.caption = "삭제된 내용입니다.";
      return reply.save();
    }

    return null;
  };

  public static getSearch = (keyword: string) => {
    return PostModel.aggregate([
      {
        $search: {
          index: "contentIndex",
          compound: {
            must: [
              {
                text: {
                  query: keyword,
                  path: ["title", "text"],
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                },
              },
            ],
          },
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: LikeModel.collection.name,
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      { $unwind: "$likes" },
      {
        $project: {
          _id: 1,
          "user._id": 1,
          "user.profile.username": 1,
          "user.profile.profile_pic": 1,
          createdAt: 1,
          title: 1,
          text: 1,
          comments: 1,
          likes: 1,
          score: { $meta: "searchScore" },
        },
      },
    ]);
  };

  public static addReply = async (
    user: HydratedDocument<User>,
    comment: HydratedDocument<Comment>,
    context: string
  ) => {
    const newComment = new CommentModel({
      user: user._id,
      caption: context,
      replies: [],
    });

    comment.replies.push(newComment._id);

    return Promise.all([newComment.save(), user.save(), comment.save()]);
  };
}

export default postService;
