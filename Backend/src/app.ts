import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import createError from "http-errors";
import { router } from "./routes";
import { initSocket } from "./socket";
import "dotenv/config";
import { verify } from "./middleware/jwt";

const app = express(); // express module on

app.use(cors());
app.use(express.static("../public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);
// app.use((req, res, next) => {
//   res.promise(Promise.reject(createError(404)));
// });
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

const server = app.listen(process.env.PORT || 4000); // port 4000인 server 실행
initSocket(server, 3000);
