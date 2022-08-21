const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
const mongoose = require("mongoose");
const crypto = require(`crypto`);
const multer = require("multer");
const path = require('path');
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

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
        const {post_title, post_text, post_user} = req.body;

        const converter = new QuillDeltaToHtmlConverter(post_text.ops,{});
        const content = converter.convert();
                
        User.findOne({publicAddr:`${publicAddress}`})
        .then((user)=>{
            if(!user){
                return res.status(401).send({error: 'User not Found'});
            }

            const like = new Like({
                
           });
           like.save();

           const comment = new Comment({
                comments:[]
           });
            comment.save();

           const post = new Post({
            user: user.id,
            title: post_title,
            text: content,
            likes: like,
            comments: comment
        });
            post.save();
            return {user, post};
        })
        .then( async ({user, post})=>{
            await User.updateOne({
                id: user._id
            },
            {
                $push:{"profile.post_ids": post._id}
            });
            
            const data = {
                    post_id : post.id,
                    post_username: user.profile.username,
                    post_userPic: user.profile.profile_pic,
                    post_title: post.title,
                    post_text: post.text,
                    post_liked: post.likes,
                    post_comments: post.comments,
                };

                return res.send(data);                
            
        });
    },
    upload
    ,
    getPost : (req, res, next)=>{        

       const posts_result = Post.find().sort({createdAt:-1}).limit(10).skip(0).exec();
       
        posts_result.then(async (posts)=>{
            await Promise.all(posts.map(async (post)=>{
                const result = await Post.findOne({_id:`${post.id}`})
                .populate('comments').populate('likes').populate('user', '', User).exec();
                return result;
            })).then( (results) => {
                console.log(results);
                let datas = [];
                results.map((result)=>{
                    const data = {
                        post_id : result.id,
                        post_username: result.user.profile.username,
                        post_userPic: result.user.profile.profile_pic,
                        post_title: result.title,
                        post_text: result.text,
                        post_liked: result.likes,
                        post_comments: result.comments,
                        post_createdAt: result.createdAt,
                    };
                    datas.push(data);
                })
                res.send(datas);                
            })
           
        })
    
    },
    addLike : async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {likes} = req.body;
        const post_id = req.params

        await User.findOne({id:publicAddress})
        .then( (user)=>{

            Like.findOne({_id:likes._id})
                .then(like=>{
            
                like.liked_user.addToSet(user.id);
                like.save((err,data)=>{
                if(err) console.log(err);
                    console.log(data);
                return res.send(like);
            })    
        }); 
        });
    },
    delLike : async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {likes} = req.body;
        const post_id = req.params

        await User.findOne({id:publicAddress})
        .then( (user)=>{
            Like.findOne({_id:likes._id})
                .then(like=>{            
            
            like.liked_user.pull(user.id);
            like.save((err,data)=>{
                if(err) console.log(err);
                console.log(data);
                return res.send(like);
            })    
        }); 
        });
    },
    getComment: async(req,res,next)=>{
        const comment_id = req.params.comment_id;
        console.log(comment_id);
        
        const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
        .populate('comments.reply.user','',User).exec();        
        return res.send(result);
    },
    addComment: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {context} = req.body;
        const comment_id = req.params.comment_id;

        if(!context) return res.status(400).send('invalid context');

        await User.findOne({publicAddr:publicAddress})
            .then((user)=>{            
            Comment.findOne({_id:comment_id})
             .then( async (comment)=>{            
            comment.comments.push({user:user.id,caption:context,});
            user.profile.comments_ids.addToSet(comment.id);
            user.save();
            comment.save().then(async ()=>{
                const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
                .populate('comments.reply.user','',User).exec();
                return res.send(result);
            })                        
        }).catch(err=>{return res.send(err)})
        })

    } ,
    likeComment:(req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {commentIndex} = req.body;
        const comment_id = req.params.comment_id;
        console.log(commentIndex);

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findById(comment_id)
        .then(async (comment)=>{
            console.log(comment);
            comment.comments[commentIndex].liked_user.addToSet(user.id);
            await comment.save();

            return res.send(comment.comments[commentIndex].liked_user);
        })
        })        
    },
    addReply : async (req, res, next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {commentIndex, context} = req.body;
        const comment_id = req.params.comment_id;

        if(!context) return res.status(400).send('invalid context');

        await User.findOne({publicAddr:publicAddress})
            .then((user)=>{            
            Comment.findOne({_id:comment_id})
             .then( async (comment)=>{            
            comment.comments[commentIndex].reply.push({user:user.id, caption: context,});                        
            comment.save().then(async ()=>{
                const result = await Comment.findById(`${comment_id}`).populate('comments.reply.user','',User).exec();
                return res.send(result.comments[commentIndex].reply);
            })                        
        }).catch(err=>{return res.send(err)})
        })
    },
    likeReply: (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {commentIndex, replyIndex} = req.body;
        const comment_id = req.params.comment_id;

        console.log(commentIndex);

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findById(comment_id)
        .then(async (comment)=>{
            console.log(comment);
            comment.comments[commentIndex].reply[replyIndex].liked_user.addToSet(user.id);
            await comment.save();

            return res.send(comment.comments[commentIndex].reply[replyIndex].liked_user);
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

