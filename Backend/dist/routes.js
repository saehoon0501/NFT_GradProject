"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./components/auth"));
const users_1 = __importDefault(require("./components/users"));
const posts_1 = __importDefault(require("./components/posts"));
const polls_1 = __importDefault(require("./components/polls"));
const uploads_1 = __importDefault(require("./components/uploads"));
const billboard_1 = __importDefault(require("./components/billboard"));
const router = express_1.default.Router();
router.use("/auth", auth_1.default);
router.use("/user", users_1.default);
router.use("/post", posts_1.default);
router.use("/poll", polls_1.default);
router.use("/uploads", uploads_1.default);
router.use("/billboard", billboard_1.default);
module.exports = router;
