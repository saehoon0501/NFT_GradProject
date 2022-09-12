const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const services = require('./services');
const User = require('./models/user.model');
const Web3 = require('web3')
const config = require('./config')
const DistrictK = require("./contracts/DistrictK.json");


const app = express(); // express module on

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+'public')));

app.use('/api', services);

const server = app.listen(4000); // port 4000인 server 실행
const io = require('socket.io')(server,{
    cors:{
        origin: "http://localhost:3000"
    }
})

const namespace = io.of('/comment')

app.set('mainIo', io)
app.set("postIo", namespace)

// const web3 = new Web3(`ws://127.0.0.1:8545`)

// const subscription = web3.eth.subscribe('logs',{
//     address: config.contractAddress,
//     topics:[web3.utils.sha3('Transfer(address,address,uint256)')]
// },(err, result)=>{
//     if(err) console.log(err)
// })

// subscription.on('data', event=> {
//     console.log(event)
//     User.findOne({publicAddr:`${event.topics[2]}`})
//     .then((user)=>{
//         if(user) return console.log('user found')

//         const user1 = new User({
//         publicAddr: `${event.topics[2]}`,
//         ownerOfNFT:[{collection_id:"NCC 1st", 
//             NFT_URL:["https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/111.png",
//             "https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/199.png"]}],
//         profile:{username:"0xbe38d61731FB86D9A981f38F1bD73b106E80ce32", 
//         caption:"", 
//         points: 0, 
//         post_ids:[], 
//         profile_pic:"https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/199.png"
//     }})
//     console.log(user1)
//     // user1.save();
//     })
// })

//authentication을 위한 함수
// io.use((socket, next)=>{
    // next()
// })

//online user들 저장 및 업데이트
let onlineUsers = []

const addNewUser = (publicAddr, socketId)=>{
    !onlineUsers.some((user)=>user.publicAddr === publicAddr) &&
    onlineUsers.push({publicAddr,socketId})
}

const deleteUser = (socketId)=>{
    onlineUsers.filter((user)=> user.socketId !== socketId)
}

const getUser = (user) =>{
    return onlineUsers.find((user)=> user.publicAddr === publicAddr)
}

io.on("connection",(socket)=>{
    socket.on("newUser", (publicAddr)=>{
        addNewUser(publicAddr,socket.id)
        io.emit("onlineUsers", {onlineUsers})
    })

    socket.on("sendNotification",({sender, receiver, type})=>{
        const receiveUser = getUser(receiver)
        const sendUser = getUser(sender)
        console.log('socket emit Notification', sendUser)
        io.to(receiveUser.socketId).emit("getNotification", {sender,type})
        io.to(sendUser.socketId).emit("getNotification", {sender,type})
    })

    socket.on("disconnect",()=>{
        deleteUser(socket.id)
    })
})

namespace.on('connection', (socket)=>{
    console.log('someone logged in')

    socket.on('join', (post_id)=>{
        socket.join(post_id)
        namespace.to(post_id).emit('testsocket', `${comment_id} joined`)
    })

    socket.on('disconnect', ()=>{
        console.log('someone has left')
    })
})