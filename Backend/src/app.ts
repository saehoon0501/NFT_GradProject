import express from "express";
import cors from "cors";
import { AppRouter } from "./AppRouter";
import { initSocket } from "./socket";
import { PORT } from "./config/dev";
// import { router } from "./routes";
import "./users/model/UserEntity";
import "./posts/model/CommentEntity";
import "./posts/model/LikeEntity";
import "./posts/model/PostEntity";
import "./users/users.repository";
import "./users/auth.service";
import "./users/users.service";
import "./users/users.controller";
import "./posts/posts.repository";
import "./posts/likes.repository";
import "./posts/comments.repository";
import "./posts/posts.serializer";
import "./posts/posts.service";
import "./posts/posts.controller";
const bodyParser = require("body-parser");

const app = express(); // express module on

app.use(cors());
app.use(express.static("../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", AppRouter.getInstance());
// app.use("/api", router);
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

const server = app.listen(PORT || 4000); // port 4000인 server 실행
initSocket(server, 3000);
