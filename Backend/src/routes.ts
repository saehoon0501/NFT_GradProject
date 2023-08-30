import express from "express";
import postRouter from "./posts";
import pollRouter from "./polls";
import uploadRouter from "./uploads";
import { verify } from "./middleware/jwt";

const router = express.Router();

router.use(verify);
router.use("/post", postRouter);
router.use("/poll", pollRouter);
router.use("/upload", uploadRouter);

export { router };
