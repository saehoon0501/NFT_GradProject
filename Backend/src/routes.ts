import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import postRouter from "./posts";
import pollRouter from "./polls";
import uploadRouter from "./uploads";
// import billboardRouter from "./components/billboard";
import { verify } from "./middleware/jwt";

const router = express.Router();

// router.use("/auth", authRouter);
router.use(verify);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/poll", pollRouter);
router.use("/upload", uploadRouter);
// router.use("/billboard", billboardRouter);

export { router };
