import express from "express";
import cors from "cors";
import { AppRouter } from "./AppRouter";
import { initSocket } from "./socket";
import { redisClient } from "./cache/cache";
import "./users/model/UserEntity";
import "./posts/model/CommentEntity";
import "./posts/model/LikeEntity";
import "./posts/model/PostEntity";
import "./users/users.repository";
import "./users/auth.service";
import "./users/users.service";
import "./users/users.controller";
import "./posts/repositories/likes.repository";
import "./posts/repositories/comments.repository";
import "./posts/repositories/posts.repository";
import "./posts/repositories/uploads.repository";
import "./posts/uploads.service";
import "./posts/posts.serializer";
import "./posts/posts.service";
import "./posts/posts.controller";
import "./posts/uploads.service";
import "./uploads/uploads.controller";
import "./cache/cache";
import path from "path";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", AppRouter.getInstance());
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});
const server = app.listen(process.env.PORT || 4000, async () => {
  await redisClient.connect();
  console.log("running server on", process.env.PORT || 4000);
}); // port 4000인 server 실행
initSocket(server, 3000);
