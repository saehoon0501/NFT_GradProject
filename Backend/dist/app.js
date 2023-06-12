"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const socket_1 = require("./socket");
const app = (0, express_1.default)(); // express module on
app.use((0, cors_1.default)());
app.use(express_1.default.static("../public"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.router);
// app.use((req, res, next) => {
//   res.promise(Promise.reject(createError(404)));
// });
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ error: err.message });
});
const server = app.listen(process.env.PORT || 4000); // port 4000인 server 실행
(0, socket_1.initSocket)(server, 3000);
