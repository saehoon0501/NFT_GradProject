const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
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
        
        let user = await User.findOne({publicAddr:publicAddress})
        
        if(user.profile.post_ids.includes(post_id)){
            Post.findOne({_id:post_id}).lean()
            .then((post)=>{
                Promise.all([Post.deleteOne({_id:post_id}),Like.deleteOne({_id:post.likes}),
                post.comments.map((comment_id)=>{
                    Comment.findById(comment_id).lean()
                    .then((comment)=>{
                        console.log('delPost의 comment들 댓글 길이', comment.replies.length)
                        if(comment.replies.length>0){                            
                            comment.replies.map(async (reply_id)=>{
                                console.log('reply_id',reply_id)                                
                                await Comment.deleteOne({_id:reply_id})
                            })                            
                        }
                        Comment.deleteOne({_id:comment_id}).then((result)=>console.log('delPost comment deleted', result))   
                    })
                                                              
                })]).then((result)=>{                    
                    console.log('delPost Promise all 결과', result)
                    user.profile.post_ids.pull(post_id)
                    user.save()
                    .then( async ()=>{                                                
                        return res.send('post deleted')
                    })
                })                                                        
            })                                                                        
        }else{
            return res.send('user is not the writer')
        }            
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
        if(!result) return res.status(400).send('no post found')
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
        .then(()=>res.send('comment added'))        
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
                console.log('delComment', post)
                post.comments.pull(comment_id)                                                
            }else{                
            comment.caption='삭제된 내용입니다.'
            comment.user = null                               
            comment.save()            
        }
        user.profile.comment_ids.pull(comment_id)               

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
        
        Promise.all([newComment.save(),user.save(),comment.save()])
                
        console.log(comment.replies)
    
        return res.send('답글 추가됨')                    
    },

    delReply: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {reply_id} = req.body;
        const comment_id = req.params.comment_id;

        const user = await User.findOne({publicAddr:publicAddress}).lean()
        let reply = await Comment.findById(reply_id)
        let comment = await Comment.findById(comment_id).lean()
        
        if(!user | !reply | !comment) return res.status(400).send('not found error')

        console.log(comment.replies)
        console.log(reply._id)

        let isInArray = comment.replies.some((replyItem)=>{
            return replyItem.equals(reply.id)
        })
        console.log(isInArray)
        if(user._id.toString() == reply.user.toString() && isInArray){
           reply.user = null
           reply.caption = '삭제된 메세지입니다.'
           reply.liked_user = null
           console.log(reply)
           await reply.save()
        }

        return res.send('reply deleted')
    },
    getSearch:async (req,res,next)=>{
        const keyword = req.query.keyword

        //keyword filter needed

        let result = await Post.aggregate([
            {$search:{                    
                "index": "contentIndex",
                "compound": {
                    "must": [{
                        "text": {
                            "query": keyword,
                            "path": ["title", "text"],
                            fuzzy:{maxEdits:2,prefixLength:2}
                          }
                        }]
                    }
                }
        },
            {$project:{            
                    "_id": 1,
                    user:1,
                    "title": 1,
                    "text":1,
                    likes:1,
                    comments:1,
                    score: { $meta: "searchScore" }                
                }
        }
    ]).limit(10)
    
    await User.populate(result, {path:'user', select:{_id:1, profile:1}})

    console.log('Search result', result)
    
    return res.send(result)
    }
}

