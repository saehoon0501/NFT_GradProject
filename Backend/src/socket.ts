import { socketUser } from "./components/users/model";
import socketIO from "socket.io";

let io: socketIO.Server;

const initSocket = (server, corsPort) => {
  io = new socketIO.Server(server, {
    cors: {
      origin: `http://localhost:${corsPort}`,
    },
  });
  io.on("connection", initialize);
};

//online user들 저장 및 업데이트
let onlineUsers: socketUser[] = [];

const deleteUser = (publicAddr) => {
  onlineUsers = onlineUsers.filter((user) => user.publicAddr !== publicAddr);
};

const addNewUser = (user: socketUser): void => {
  !onlineUsers.some(
    (onlineUser) => onlineUser.publicAddr === user.publicAddr
  ) && onlineUsers.push(user);
};

const getUser = (publicAddr: string): socketUser | undefined => {
  let foundUser = onlineUsers.find((user) => user.publicAddr === publicAddr);

  if (typeof foundUser === "undefined") {
    return undefined;
  }
  return foundUser;
};

const initialize = (socket) => {
  console.log("someone logged in");
  io.on("newUser", (newUser: socketUser) => {
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

export { initSocket, io };
