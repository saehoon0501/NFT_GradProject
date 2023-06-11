"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
const service_2 = __importDefault(require("../users/service"));
const QuillDeltaToHtmlConverter = require("quill-delta-to-html").QuillDeltaToHtmlConverter;
class postController {
}
_a = postController;
postController.getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            result = yield service_1.default.getBestPosts(lastWeek, pageNum);
        }
        else {
            result = yield service_1.default.getPosts(pageNum);
        }
        return res.send(result);
    }
    catch (error) {
        next(error);
    }
});
postController.createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user) {
            throw new Error("User Not Found");
        }
        const like = yield service_1.default.createLike();
        const post = yield service_1.default.createPost({
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
    }
    catch (err) {
        next(err);
    }
});
postController.delPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        const post_id = req.params.post_id;
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (user.profile.post_ids.includes(post_id) || user.role == "admin") {
            const post = yield service_1.default.findPost(post_id);
            if (!post) {
                throw new Error("Post Not Found");
            }
            const result = yield service_1.default.deletePost(post_id, post, user);
            if (!result) {
                throw new Error("Post deletion Stopped");
            }
            return res.send("Post Deleted");
        }
        return res.send("Post Not Deleted");
    }
    catch (error) {
        next(error);
    }
});
postController.likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        const { likes } = req.body;
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user) {
            throw new Error("User Not Found");
        }
        const like = yield service_1.default.getLike(likes._id);
        if (!like) {
            throw new Error("Like Not Found");
        }
        if (!like.liked_user.includes(user.id)) {
            like.liked_num += 1;
            like.liked_user.addToSet(user.id);
            yield like.save();
        }
        return res.send(like);
    }
    catch (error) {
        next(error);
    }
});
postController.delLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        const { likes } = req.body;
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user) {
            throw new Error("User Not Found");
        }
        let like = yield service_1.default.getLike(likes._id);
        if (!like) {
            throw new Error("Like Not Found");
        }
        if (like.liked_user.includes(user.id)) {
            like.liked_num -= 1;
            like.liked_user.pull(user.id);
        }
        like.save((err, data) => {
            if (err)
                throw new Error("Like Not Found");
            console.log(data);
            return res.send(like);
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
postController.getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.post_id;
        const result = yield service_1.default.getComments(post_id);
        return res.send(result);
    }
    catch (error) {
        next(error);
    }
});
postController.addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        let { context } = req.body;
        const post_id = req.params.post_id;
        if (!context == undefined || !/([^\s])/.test(context)) {
            throw new Error("Need any character");
        }
        context = context.replace(/^\s+/g, "");
        context = context.replace(/\s+$/g, "");
        console.log(publicAddress);
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user) {
            throw new Error("User Not Found");
        }
        yield service_1.default.updateComment({
            user: user._id,
            caption: context,
            replies: [],
        }, publicAddress, post_id);
        return res.send("Success");
    }
    catch (error) {
        next(error);
    }
});
postController.likeComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        const comment_id = req.params.comment_id;
        const user = yield service_2.default.getUserByAddress(publicAddress);
        if (!user) {
            throw new Error("User Not Found");
        }
        const comment = yield service_1.default.getCommentById(comment_id);
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        comment.liked_user.addToSet(user.id);
        const result = yield comment.save();
        console.log(result);
        return res.send(comment.liked_user);
    }
    catch (error) {
        next(error);
    }
});
postController.modifyComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        let { context } = req.body;
        const comment_id = req.params.comment_id;
        if (!context == undefined || !/([^\s])/.test(context)) {
            throw new Error("Need any character");
        }
        context = context.replace(/^\s+/g, "");
        context = context.replace(/\s+$/g, "");
        const user = yield service_2.default.getUserByAddress(publicAddress);
        let comment = yield service_1.default.getCommentById(comment_id);
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
            comment.save().then(() => __awaiter(void 0, void 0, void 0, function* () {
                return res.send("comment modified");
            }));
        }
        else {
            throw new Error("not a writer of comment");
        }
    }
    catch (error) {
        next(error);
    }
});
postController.delComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        const { post_id } = req.body;
        const comment_id = req.params.comment_id;
        if (post_id === undefined || comment_id === undefined) {
            throw new Error("Post_id or Comment_id is missing");
        }
        const user = yield service_2.default.getUserByAddress(publicAddress);
        let comment = yield service_1.default.getCommentById(comment_id);
        let post = yield service_1.default.getPostById(post_id);
        yield service_1.default.deleteComment(user, comment, post);
        return res.send("message deleted");
    }
    catch (err) {
        next(err);
    }
});
postController.addReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicAddress = res.locals.decoded.publicAddress;
        let { context } = req.body;
        const comment_id = req.params.comment_id;
        if (context == undefined || !/([^\s])/.test(context)) {
            throw new Error("Need any character");
        }
        context = context.replace(/^\s+/g, "");
        context = context.replace(/\s+$/g, "");
        let user = yield service_2.default.getUserByAddress(publicAddress);
        let comment = yield service_1.default.getCommentById(comment_id);
        if (comment == null || user == null)
            throw new Error("comment or user not found");
        yield service_1.default.addReply(user, comment, context);
        return res.send("Success");
    }
    catch (err) {
        next(err);
    }
});
postController.delReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const publicAddress = res.locals.decoded.publicAddress;
    const { reply_id } = req.body;
    const comment_id = req.params.comment_id;
    try {
        const user = yield service_2.default.getUserByAddress(publicAddress);
        let reply = yield service_1.default.getCommentById(reply_id);
        let comment = yield service_1.default.getCommentById(comment_id);
        if (!user || !reply || !comment)
            throw new Error("Something Not Found");
        const result = yield service_1.default.deleteReply(user, reply, comment);
        if (!result) {
            throw new Error("Reply Deletion Failed");
        }
        return res.send("reply deleted");
    }
    catch (error) {
        next(error);
    }
});
postController.getSearch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = req.query.keyword;
    try {
        if (keyword == null || keyword.length < 2)
            throw new Error("Keyword should be at least have 2 characters");
        let result = yield service_1.default.getSearch(keyword);
        if (!result) {
            throw new Error("Search Not Found");
        }
        return res.send(result);
    }
    catch (error) {
        console.log("Search Error", error);
        return res.status(400).send(error);
    }
});
exports.default = postController;
