const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
const mongoose = require("mongoose");
const crypto = require(`crypto`);
const multer = require("multer");
const path = require('path');
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

module.exports={
    getPost : (req, res, next)=>{        

       const posts_result = Post.find().sort({createdAt:-1}).limit(10).skip(0).exec();
       
        posts_result.then(async (posts)=>{
            await Promise.all(posts.map(async (post)=>{
                const result = await Post.findOne({_id:`${post.id}`})
                .populate('comments').populate('likes').populate('user', '', User).lean().exec();
                return result
            })).then((results) => {
                console.log('getPost 실행', results);
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
                
        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            if(!user){
                return res.status(401).send({error: 'User not Found'});
            }

            const like = new Like({});
           
           const post = new Post({
            user: user.id,
            title: post_title,
            text: content,
            likes: like,            
        });
            like.save()            
            post.save()
            return {user, post,like}
        }).then( async ({user, post, like})=>{
            await User.updateOne({
                _id: user.id
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
                    comments: [],         
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
                    post.comments.map((comment_id)=>{
                        Comment.findById(comment_id).lean()
                        .then((comment)=>{
                            comment.replies.map((reply_id)=>Comment.deleteOne({_id:reply_id}))                            
                        })                                             
                    }),Comment.deleteOne({_id:comment_id})])                                                        
                })                                                
            }
            user.profile.post_ids.pull(post_id)
            user.save().then( async ()=>{
                const posts_result = await Post.find().sort({createdAt:-1}).limit(10).skip(0)
                .populate('comments').populate('likes').populate('user', '', User).lean().exec(); 
                
                return res.send(posts_result)
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
        const post_id = req.params.post_id;
        
        const result = await Post.findById(`${post_id}`).lean().exec()
        Promise.all(result.comments.map(async (comment)=>{
           const result = await Comment.findById(`${comment}`).populate('user','',User).populate({
            path:'replies',
            model:Comment,
            populate:{
                path:'user',
                model:User
            }
           })
           return result
        })).then((result)=>{
            console.log('getComment 실행', result)
            return res.send(result);
        })               
    },

    addComment: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {context} = req.body;
        const post_id = req.params.post_id;

        if(!context) return res.status(400).send('invalid context');

        let user = await User.findOne({publicAddr:publicAddress}).lean()

        console.log('댓글 추가 user Found', user)

        const comment = new Comment({
            user:user._id,
            caption:context,
            replies:[]
        })        

        await Promise.all([User.updateOne({publicAddr:publicAddress},{$addToSet:{'profile.comment_ids':comment._id}}),
        Post.updateOne({_id:post_id},{$addToSet:{comments:comment._id}}),comment.save()])        
    },

    likeComment:(req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {commentIndex} = req.body;
        const comment_id = req.params.comment_id;
        console.log(commentIndex);

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            Comment.findById(comment_id)
        .then((comment)=>{
            console.log(comment);
            comment.liked_user.addToSet(user.id);
            comment.save();

            return res.send(comment.liked_user);
        })
        })        
    },

    modifyComment:(req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress
        const {context} = req.body
        const comment_id = req.params.comment_id

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            if(!user) return res.status(400).send('user not found')
            
            Comment.findOne({_id:comment_id})
             .then(async (comment)=>{
                if(user.id==comment.user.toString()){                
                    comment.caption=context                         
                    comment.save().then(async ()=>{                        
                    return res.send('comment modified')
                })
            }else{
                return res.status(400).send('not a owner of comment')
            }                        
        }).catch(err=>{return res.send(err)})
        })
    },

    delComment: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress
        const {post_id} = req.body
        const comment_id = req.params.comment_id
        
        let result = await Promise.all([User.findOne({publicAddr:publicAddress}),
            Comment.findOne({_id:comment_id}), Post.findOne({_id:post_id})])
        
        let user = result[0]
        let comment = result[1]
        let post = result[2]

        if(user.id==comment.user.toString()){           
            if(comment.replies.length<=0){                        
            Comment.deleteOne({_id:comment_id})                                                
            }else{                
            comment.caption='삭제된 내용입니다.'
            comment.user = null                               
            commnet.save()            
        }
        user.profile.comment_ids.pull(comment_id)
        post.comments.pull(comment_id)         

        user.save()
        post.save()        
        .then(async ()=>{            
            return res.send('message deleted')
        })
        }else{
            return res.status(400).send('not a owner of comment')
        }                        
    },

    addReply : async (req, res, next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {context} = req.body;
        const comment_id = req.params.comment_id;

        if(!context) return res.status(400).send('invalid context')

        let user = await User.findOne({publicAddr:publicAddress})
                        
        let comment = await Comment.findOne({_id:comment_id})
            
        const newComment = new Comment({
                user:user._id,
                caption:context,
                replies:null
        })
        
        console.log('작성된 답글', newComment)        
        comment.replies.push(newComment._id)                        
        comment.markModified('replies')
        user.profile.comment_ids.addToSet(newComment._id)
        
        await Promise.all([newComment.save(),user.save(),comment.save()])
                
        console.log(comment.replies)
        const result = await Comment.findById(`${comment_id}`)
        .populate({
            path:'replies',
            model: Comment,
            populate:{
                path:'user',
                model:User
            }
        }).lean().exec();
            
            console.log('addReply 실행', result)
            return res.send(result.replies)                    
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
                    comment.comments[commentIndex].reply[replyIndex].user = null                 
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
