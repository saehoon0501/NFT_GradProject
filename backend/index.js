const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const services = require('./services');
const User = require('./models/user.model');

const app = express(); // express module on



// const user1 = new User({
//   publicAddr:"0xbe38d61731fb86d9a981f38f1bd73b106e80ce32",
// ownerOfNFT:[{collection_id:"azuki", NFT_URL:["https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/111.png",
//  "https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/199.png"]}],
// profile:{username:"0xbe38d61731FB86D9A981f38F1bD73b106E80ce32", 
// caption:"", 
// points: 0, 
// post_ids:[], 
// profile_pic:"https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/199.png"
// }});

// user1.save();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname+'public')));

app.use('/api', services);

const server = app.listen(4000); // port 4000인 server 실행
const io = require('socket.io')(server)

//authentication을 위한 함수
io.use((socket, next)=>{
    
})

const namespace = io.of('/comment')

namespace.on('connection', (socket)=>{
    console.log('someone logged in')

    socket.on('join', (comment_id)=>{
        socket.join(comment_id)
        namespace.to(comment_id).emit('testsocket', comment_id)
    })

    socket.on('disconnect', ()=>{
        console.log('someone has left')
    })
})