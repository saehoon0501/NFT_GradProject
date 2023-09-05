import express from "express";
import cors from "cors";
import { AppRouter } from "./AppRouter";
import { initSocket } from "./socket";
import { PORT } from "./config/dev";
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
import "./posts/posts.serializer";
import "./posts/posts.service";
import "./posts/posts.controller";
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express(); // express module on

app.use(cors());
app.use(express.static("../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", AppRouter.getInstance());
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

const server = app.listen(PORT || 4000, () => {
  console.log("running server on", PORT);
}); // port 4000인 server 실행
initSocket(server, 3000);
