"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.initSocket = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
let io;
const initSocket = (server, corsPort) => {
    exports.io = io = new socket_io_1.default.Server(server, {
        cors: {
            origin: `http://localhost:${corsPort}`,
        },
    });
    io.on("connection", initialize);
};
exports.initSocket = initSocket;
//online user들 저장 및 업데이트
let onlineUsers = [];
const deleteUser = (publicAddr) => {
    onlineUsers = onlineUsers.filter((user) => user.publicAddr !== publicAddr);
};
const addNewUser = (user) => {
    !onlineUsers.some((onlineUser) => onlineUser.publicAddr === user.publicAddr) && onlineUsers.push(user);
};
const getUser = (publicAddr) => {
    let foundUser = onlineUsers.find((user) => user.publicAddr === publicAddr);
    if (typeof foundUser === "undefined") {
        return undefined;
    }
    return foundUser;
};
const initialize = (socket) => {
    console.log("someone logged in");
    io.on("newUser", (newUser) => {
        addNewUser(newUser);
        io.emit("onlineUsers", { onlineUsers });
    });
    // io.on("disconnect", () => {
    //   console.log("disconnect");
    //   deleteUser(socket.id);
    // });
    const namespace = io.of("/comment");
    namespace.on("connection", (socket) => {
        socket.on("join", (post_id) => {
            console.log(`someone just joined post: ${post_id}`);
        });
        socket.on("disconnect", () => {
            console.log("someone has left");
        });
    });
};
