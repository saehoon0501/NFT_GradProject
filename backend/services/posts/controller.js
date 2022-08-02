const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const crypto = require(`crypto`);
const multer = require("multer");
const path = require('path');
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

mongoose.connect('mongodb://localhost:27017/Postdb');

const conn = mongoose.connection;
let gfs, gridfsBucket;

conn.once('open', ()=>{
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName:'uploads'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
})

const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/Postdb',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

  const upload = multer({ storage });

module.exports={
    createPost : (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {caption} = req.body;

        User.findOne({publicAddr:`${publicAddress}`})
        .then((user)=>{
            if(!user){
                return res.status(401).send({error: 'User not Found'});
            }

            const like = new Like({
                liked_user: []
           });
           like.save();

           const comment = new Comment({
                comments:[]
           });
            comment.save();

           const post = new Post({
            user: user.id,
            imgs:[req.file.id.toString()],
            caption: caption,
            likes: like.id,
            comments: comment.id
        });
            post.save();

            return {user_id:user.id, post_id:post.id};
        })
        .then(({user_id,post_id})=>{
            User.updateOne({
                id: user_id
            },
            {
                $push:{"profile.post_ids": post_id}
            }).then(()=>{
                return res.send("post created");
            });
        });
    },
    upload
    ,
    getPost : (req, res, next)=>{        

       const posts_result = Post.find().sort({createdAt:-1}).limit(10).skip(0).exec();
       
        posts_result.then(async (posts)=>{
            let results = [];

            await Promise.all(posts.map(async (post)=>{
                const result = await Post.findOne({_id:`${post.id}`})
                .populate('comments').populate('likes').populate('user', '', User).exec();
                results.push(result);
            }));
            
            return results;
       }).then(async (results)=>{

        await Promise.all(results.map(async (result)=>{
            
            const file = await gfs.files.findOne(result.imgs[0]);
            
            if(!file){
                return res.status(401).send('error file not found');
            }

            if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){                
                const base64 = await readImage(file)
                const sndData = {
                    post_id : result.id,
                    post_username: result.user.profile.username,
                    post_userProfile: result.user.profile.profile_pic,
                    post_liked: result.likes,
                    post_comments: result.comments,
                    base64};
                    return sndData 
                    }
                })).then((sndData)=>{
                    console.log('post data sent');
                    res.send(sndData);
            })
           
        })
    
    }
}

const readImage = (file) => {
    return new Promise(async (resolve, reject)=>{
        let buffer = [];
        const readStream = gridfsBucket.openDownloadStream(file._id);

        readStream.on('data', (chunk)=>{
            console.log('b');
            buffer.push(chunk);
        })

        readStream.on('end', ()=>{
            console.log('c');
            const fbuf = Buffer.concat(buffer);
            base64 = fbuf.toString('base64');  
            resolve(base64);
        })
    });
}

