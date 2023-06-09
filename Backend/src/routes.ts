import express from "express";
import authRouter from "./components/auth";
import userRouter from "./components/users";
import postRouter from "./components/posts";
import pollRouter from "./components/polls";
import uploadRouter from "./components/uploads";
import billboardRouter from "./components/billboard";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/poll", pollRouter);
router.use("/uploads", uploadRouter);
router.use("/billboard", billboardRouter);

export = router;
