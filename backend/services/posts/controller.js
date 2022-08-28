const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
const mongoose = require("mongoose");
const crypto = require(`crypto`);
const multer = require("multer");
const path = require('path');
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

// mongoose.connect('mongodb://localhost:27017/Postdb');

// const conn = mongoose.connection;
// let gfs, gridfsBucket;

// conn.once('open', ()=>{
//     gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
//         bucketName:'uploads'
//     });
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection("uploads");
// })

// const storage = new GridFsStorage({
//     url: 'mongodb://localhost:27017/Postdb',
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });

// const upload = multer({ storage });

module.exports={
    
    // upload,
    getPost : (req, res, next)=>{        

       const posts_result = Post.find().sort({createdAt:-1}).limit(10).skip(0).exec();
       
        posts_result.then(async (posts)=>{
            await Promise.all(posts.map(async (post)=>{
                const result = await Post.findOne({_id:`${post.id}`})
                .populate('comments').populate('likes').populate('user', '', User).lean().exec();
                return result;
            })).then( (results) => {
                console.log(results);
                res.send(results);                
            })
           
        })
    
    },

    createPost : (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;                
        const {post_title, post_text} = req.body;

        const converter = new QuillDeltaToHtmlConverter(post_text.ops,{});
        const content = converter.convert();

        if(post_title == undefined){
            return res.status(400),send('need title')
        }
                
        User.findOne({publicAddr:`${publicAddress}`})
        .then((user)=>{
            if(!user){
                return res.status(401).send({error: 'User not Found'});
            }

            const like = new Like({});
           
           const comment = new Comment({
                comments:[]
           });
            

           const post = new Post({
            user: user.id,
            title: post_title,
            text: content,
            likes: like,
            comments: comment
        });
            like.save();
            comment.save();
            post.save();
            return {user, post,like, comment};
        })
        .then( async ({user, post, like, comment})=>{
            await User.updateOne({
                id: user._id
            },
            {
                $push:{"profile.post_ids": post._id}
            })
            console.log('userinfo', user.profile.post_ids, 'postinfo', post)

            const data = {
                    _id : post.id,
                    user: user,                    
                    title: post.title,
                    text: post.text,
                    likes: like,
                    comments: comment,
                    createdAt:post.createdAt,                    
                };

                return res.send(data);                
            
        });
    },

    delPost: async (req, res, next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const post_id = req.params.post_id
        
        await User.findOne({publicAddr:publicAddress})
        .then(async (user)=>{            
            if(user.profile.post_ids.includes(post_id)){
                Post.findOne({_id:post_id}).lean().then((post)=>{
                    Promise.all([Post.deleteOne({_id:post_id}),Like.deleteOne({_id:post.likes}),
                    Comment.deleteOne({_id:post.comments})])                                                        
                })                                                
            }
            user.profile.post_ids.pull(post_id)
            user.save().then( async ()=>{
                const posts_result = await Post.find().sort({createdAt:-1}).limit(10).skip(0)
                .populate('comments').populate('likes').populate('user', '', User).lean().exec(); 
                console.log(posts_result)
                // return res.send(posts_result)
            })
        })
    },

    addLike : async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {likes} = req.body;
        const post_id = req.params

        await User.findOne({publicAddr:publicAddress})
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
        const post_id = req.params.post_id

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
        console.log(req.params);
        
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
            user.profile.comments_ids.addToSet(comment.comments[comment.comments.length-1].id);                        
            user.save();
            comment.save().then(async ()=>{
                const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
                .populate('comments.reply.user','',User).exec();
                return res.send(result);
            })                        
        }).catch(err=>{return res.send(err)})
        })

    },

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

    modifyComment:(req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress
        const {context, commentIndex} = req.body
        const comment_id = req.params.comment_id

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findOne({_id:comment_id})
             .then( async (comment)=>{
                 
                if(user.id==comment.comments[commentIndex].user.toString()){                
                comment.comments[commentIndex].caption=context
                console.log(comment.comments[commentIndex].caption)           
                comment.save().then(async ()=>{
                    const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
                    .populate('comments.reply.user','',User).exec()
                    return res.send(result.comments[commentIndex])
                })
            }else{
                return res.status(400).send('not a owner of comment')
            }                        
        }).catch(err=>{return res.send(err)})
        })
    },

    delComment:(req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress
        const {commentIndex} = req.body
        const comment_id = req.params.comment_id
        
        console.log(commentIndex)

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findOne({_id:comment_id})
            .then(async (comment)=>{   
                console.log(comment)              
                if(user.id==comment.comments[commentIndex].user.toString()){           
                    if(comment.comments[commentIndex].reply.length<=0){
                        comment.comments[commentIndex].caption='삭제'
                        user.profile.comments_ids.pull(comment.comments[commentIndex].id)
                        comment.comments.splice(commentIndex,1)                                                
                    }else{                
                   comment.comments[commentIndex].caption='삭제된 내용입니다.'                   
                   user.profile.comments_ids.pull(comment.comments[commentIndex].id)                   
                   
                   console.log(comment.comments[commentIndex])
                }
                user.save()
                comment.save().then(async ()=>{
                    const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
                    .populate('comments.reply.user','',User).exec()
                    return res.send(result.comments)
                })
            }else{
                return res.status(400).send('not a owner of comment')
            }                        
        })
    })},

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
            user.profile.comments_ids.addToSet(comment.comments[commentIndex].reply[comment.comments[commentIndex].reply.length-1].id)
                        
            user.save()                        
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
    },

    delReply: (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {commentIndex, replyIndex} = req.body;
        const comment_id = req.params.comment_id;

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findOne({_id:comment_id})
            .then(async (comment)=>{                                 
                if(user.id==comment.comments[commentIndex].reply[replyIndex].user.toString()){                                                       
                    user.profile.comments_ids.pull(comment.comments[commentIndex].reply[replyIndex].id)                    
                    comment.comments[commentIndex].reply[replyIndex].caption='삭제된 내용입니다.'                                 
                                       
                    user.save()
                    comment.save().then(async ()=>{
                        const result = await Comment.findById(`${comment_id}`).populate('comments.user','',User)
                        .populate('comments.reply.user','',User).exec()
                        return res.send(result.comments[commentIndex].reply)
                    })
            }else{
                return res.status(400).send('not a owner of comment')
            }                        
        })
    })},
}

// const readImage = (file) => {
//     return new Promise(async (resolve, reject)=>{
//         let buffer = [];
//         const readStream = gridfsBucket.openDownloadStream(file._id);

//         readStream.on('data', (chunk)=>{
//             console.log('b');
//             buffer.push(chunk);
//         })

//         readStream.on('end', ()=>{
//             console.log('c');
//             const fbuf = Buffer.concat(buffer);
//             base64 = fbuf.toString('base64');  
//             resolve(base64);
//         })
//     });
// }

