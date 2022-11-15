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

//online user들 저장 및 업데이트
let onlineUsers = []

const deleteUser = (socketId)=>{
   onlineUsers = onlineUsers.filter((user)=> user.socketId !== socketId)
}

const addNewUser = (profile_pic, username, publicAddr, socketId)=>{
    !onlineUsers.some((user)=>user.publicAddr === publicAddr) &&
    onlineUsers.push({profile_pic, username, publicAddr, socketId})
}

const getUser = (publicAddr) =>{
    return onlineUsers.find((user)=> user.publicAddr === publicAddr)
}

io.on("connection",(socket)=>{
    socket.on("newUser", ({profile_pic, username, publicAddr})=>{
        addNewUser(profile_pic, username, publicAddr, socket.id)
        io.emit("onlineUsers", {onlineUsers})
    })

    socket.on("sendNotification",({sender, receiver, type})=>{
        const receiveUser = getUser(receiver)
        
        if(receiveUser){
            io.to(receiveUser.socketId).emit("getNotification", {sender,type})            
        }                        
    })

    socket.on("disconnect",()=>{
        console.log('disconnect')
        deleteUser(socket.id)
    })
})

namespace.on('connection', (socket)=>{
    console.log('someone logged in')

    socket.on('join', (post_id)=>{
        socket.join(post_id)        
    })

    socket.on('disconnect', ()=>{
        console.log('someone has left')
    })
})

const web3 = new Web3(`ws://127.0.0.1:8545`)

const myContract = new web3.eth.Contract(config.abi,config.contractAddress);

let options = {
    filter:{
        value:[],
    },
    fromBlock: 'latest'
};

myContract.events.Minted(options).on('data', event=> {
    console.log(event.returnValues.to);
    
    User.findOne({publicAddr:event.returnValues.to.toLowerCase()})
    .then((user)=>{
        if(user){
            user.ownerOfNFT[0].NFT_URL.push(event.returnValues.tokenURI);
            console.log(user.ownerOfNFT[0].NFT_URL);
            user.save();
        }else{
            const user1 = new User({
                publicAddr: event.returnValues.to.toLowerCase(),
                ownerOfNFT:[{collection_id:"NCC 1st", 
                    NFT_URL:[event.returnValues.tokenURI]}],
                role:"user",
                profile:{username:event.returnValues.to.toLowerCase(), 
                caption:"", 
                points: 0,         
                post_ids:[], 
                profile_pic:event.returnValues.tokenURI
            }})
            console.log(user1)
            user1.save();
        }
        
    })
});

// authentication을 위한 함수
// io.use((socket, next)=>{
//     next()
// })

module.exports.namespace = namespace