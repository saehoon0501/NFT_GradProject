"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./components/auth"));
const users_1 = __importDefault(require("./components/users"));
const posts_1 = __importDefault(require("./components/posts"));
const polls_1 = __importDefault(require("./components/polls"));
const uploads_1 = __importDefault(require("./components/uploads"));
const router = express_1.default.Router();
exports.router = router;
router.use("/auth", auth_1.default);
router.use("/user", users_1.default);
router.use("/post", posts_1.default);
router.use("/poll", polls_1.default);
router.use("/uploads", uploads_1.default);
