"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_errors_1 = __importDefault(require("http-errors"));
const routes_1 = __importDefault(require("./routes"));
const user_model_1 = __importDefault(require("./components/users/user.model"));
const web3_1 = __importDefault(require("web3"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)(); // express module on
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.use((req, res, next) => {
    next(http_errors_1.default);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err);
});
const server = app.listen(4000); // port 4000인 server 실행
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const namespace = io.of("/comment");
//online user들 저장 및 업데이트
let onlineUsers = [];
const deleteUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const addNewUser = (profile_pic, username, publicAddr, socketId) => {
    !onlineUsers.some((user) => user.publicAddr === publicAddr) &&
        onlineUsers.push({ profile_pic, username, publicAddr, socketId });
};
const getUser = (publicAddr) => {
    return onlineUsers.find((user) => user.publicAddr === publicAddr);
};
io.on("connection", (socket) => {
    socket.on("newUser", ({ profile_pic, username, publicAddr }) => {
        addNewUser(profile_pic, username, publicAddr, socket.id);
        io.emit("onlineUsers", { onlineUsers });
    });
    socket.on("sendNotification", ({ sender, receiver, type }) => {
        const receiveUser = getUser(receiver);
        if (receiveUser) {
            io.to(receiveUser.socketId).emit("getNotification", { sender, type });
        }
    });
    socket.on("disconnect", () => {
        console.log("disconnect");
        deleteUser(socket.id);
    });
});
namespace.on("connection", (socket) => {
    console.log("someone logged in");
    socket.on("join", (post_id) => {
        socket.join(post_id);
    });
    socket.on("disconnect", () => {
        console.log("someone has left");
    });
});
const web3 = new web3_1.default(`ws://127.0.0.1:8545`);
const myContract = new web3.eth.Contract(config_1.default.abi, config_1.default.contractAddress);
let options = {
    filter: {
        value: [],
    },
    fromBlock: "latest",
};
myContract.events.Minted(options).on("data", (event) => {
    console.log(event.returnValues.to);
    user_model_1.default.findOne({ publicAddr: event.returnValues.to.toLowerCase() }).then((user) => {
        if (user) {
            user.ownerOfNFT[0].NFT_URL.push(event.returnValues.tokenURI);
            console.log(user.ownerOfNFT[0].NFT_URL);
            user.save();
        }
        else {
            const user1 = new user_model_1.default({
                publicAddr: event.returnValues.to.toLowerCase(),
                ownerOfNFT: [
                    {
                        collection_id: "NCC 1st",
                        NFT_URL: [event.returnValues.tokenURI],
                    },
                ],
                role: "user",
                profile: {
                    username: "안녕하세요",
                    caption: "",
                    points: 0,
                    post_ids: [],
                    profile_pic: event.returnValues.tokenURI,
                },
            });
            console.log(user1);
            user1.save();
        }
    });
});
// authentication을 위한 함수
// io.use((socket, next)=>{
//     next()
// })
module.exports.namespace = namespace;
