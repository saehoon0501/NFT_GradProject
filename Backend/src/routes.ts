import express from "express";
import uploadRouter from "./uploads";

const router = express.Router();

router.use("/upload", uploadRouter);

export { router };
