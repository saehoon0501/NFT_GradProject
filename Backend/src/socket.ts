import { socketUser } from "./users/model/UserEntity";
import socketIO from "socket.io";

let io: socketIO.Server;

const initSocket = (server, corsPort) => {
  io = new socketIO.Server(server, {
    cors: {
      origin: `http://localhost:${corsPort}`,
    },
  });
  io.on("connection", initialize);

  // const namespace = io.of("/comment");

  // namespace.on("connection", (socket) => {
  //   socket.on("join", (post_id) => {
  //     console.log(`someone just joined post: ${post_id}`);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("someone has left");
  //   });
  // });
};

//online user들 저장 및 업데이트
let onlineUsers: socketUser[] = [];

const deleteUser = (user_id) => {
  onlineUsers = onlineUsers.filter((user) => user.user_id !== user_id);
};

const addNewUser = (user: socketUser): void => {
  !onlineUsers.some((onlineUser) => onlineUser.user_id === user.user_id) &&
    onlineUsers.push(user);
};

const getUser = (user_id: string): socketUser | undefined => {
  let foundUser = onlineUsers.find((user) => user.user_id === user_id);

  if (typeof foundUser === "undefined") {
    return undefined;
  }
  return foundUser;
};

const initialize = (socket) => {
  socket.on("newUser", (newUser: socketUser) => {
    newUser.socketId = socket.id;
    addNewUser(newUser);
    io.emit("onlineUsers", { onlineUsers });
  });

  socket.on("disconnect", () => {
    deleteUser(socket.id);
  });
};

export { initSocket, io };
