const {Post, Like, Comment} = require('../../models/post.model');
const User = require('../../models/user.model');
const socket = require("../../index")
const mongoose =  require(`mongoose`)
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;

module.exports={
    getPost : (req, res, next)=>{      
                
        const filter = req.query.filter
        let pageNum = parseInt(req.query.pageNum)
        
        if(req.query.pageNum==undefined){
            pageNum=0
        }        

        let posts_result

        if(filter == "best"){
            let lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate()-14);
            console.log(lastWeek)

            posts_result = Post.aggregate([
                {$match:{"createdAt":{$gt: lastWeek},}                   
                },                                
                {$lookup:{
                    from: Like.collection.name,
                    localField: 'likes',
                    foreignField: '_id',
                    as: 'likes'
                }},
                {$unwind:'$likes'},           
                {$sort:{"likes.liked_num":-1}                    
                },
                {$skip:(pageNum*10)
                },                
                {$limit:10
                },
                {$lookup:{
                    from: User.collection.name,
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }},
                {$lookup:{
                    from: Comment.collection.name,
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'comments'
                }},                
                {$project:{
                    _id:1,
                    'user._id':1,
                    'user.publicAddr':1,
                    'user.profile.profile_pic':1,
                    'user.profile.username':1,
                    'user.profile.caption':1,
                    'user.profile.points':1,
                    'title':1,
                    'text':1,
                    'likes':1,
                    'comments._id':1,
                    'createdAt':1
                }},
                {$unwind:'$user'},
                             
            ]).exec()            
    
            posts_result.then((results)=> {                
                console.log('getPost실행', results)                
                return res.send(results)
            }).catch((error)=>res.status(400).send(error))                            
        }else{
            posts_result = Post.aggregate([           
            {$sort:{"_id":-1}
            },
            {$skip:(pageNum*10)
            },
            {$limit:10
            },
            {$lookup:{
                from: User.collection.name,
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }},
            {$lookup:{
                from: Comment.collection.name,
                localField: 'comments',
                foreignField: '_id',
                as: 'comments'
            }},
            {$lookup:{
                from: Like.collection.name,
                localField: 'likes',
                foreignField: '_id',
                as: 'likes'
            }},
            {$project:{
                _id:1,
                'user._id':1,
                'user.publicAddr':1,
                'user.profile.profile_pic':1,
                'user.profile.username':1,
                'user.profile.caption':1,
                'user.profile.points':1,
                'title':1,
                'text':1,
                'likes':1,
                'comments':1,
                'createdAt':1
            }},
            {$unwind:'$user'},
            {$unwind:'$likes'},                        
        ]).exec()

        posts_result.then((results)=> {
            console.log('getPost실행')
            return res.send(results)
        }).catch((error)=>res.status(400).send(error))
    }                
    },

    createPost : (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;                
        let {post_title, post_text} = req.body;

        const converter = new QuillDeltaToHtmlConverter(post_text.ops,{});
        const content = converter.convert();
        
        if(post_title == undefined || !/([^\s])/.test(post_title)){            
            return res.status(400).send('Need title')
        }
        post_title = post_title.replace(/^\s+/g,"")
        post_title = post_title.replace(/\s+$/g, "")
        
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
            .then( async ()=>{
                await User.updateOne({
                    _id: user.id
                },
                {
                    $push:{"profile.post_ids": post._id}
                })

                console.log("Post created")
                const data = {
                    _id : post.id,
                    user: user,                    
                    title: post.title,
                    text: post.text,
                    likes: like,           
                    comments: [],         
                    createdAt:post.createdAt,                    
                }

            return res.send(data)
            })        
        })
    },

    delPost: async (req, res, next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const post_id = req.params.post_id
        let user

        try{
         user = await User.findOne({publicAddr:publicAddress})
        }catch(error){
            return res.status(400).send(error)
        }

        if(user.profile.post_ids.includes(post_id)){
            Post.findById(post_id).lean()
            .then((post)=>{
                if(post==null) return res.status(400).send("Post not found")

                Promise.all([Post.deleteOne({_id:post_id}),Like.deleteOne({_id:post.likes}),
                post.comments.map((comment_id)=>{
                    Comment.findById(comment_id).lean()
                    .then((comment)=>{                        
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
                }).catch((error)=>res.status(400).send(error))                                                        
            })                                                                        
        }else{
            return res.send('Not a writer of post')
        }            
    },
    addLike : async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {likes} = req.body;        

        await User.findOne({publicAddr:publicAddress}).lean()
        .then( (user)=>{
            Like.findById(likes._id)
            .then(like=>{
            if(!like.liked_user.includes(user._id)){
                like.liked_num += 1
                like.liked_user.addToSet(user._id)
            }
                like.save((err,data)=>{
                if(err) console.log(err)
                    console.log(data)
                return res.send(like)
                })    
            })
            .catch((error)=>res.status(400).send(error))  
        })
    },

    delLike : async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {likes} = req.body;        

        await User.findOne({id:publicAddress}).lean()
        .then( (user)=>{
            Like.findById(likes._id)
            .then(like=>{
            if(like.liked_user.includes(user._id)){
                like.liked_num -= 1
                like.liked_user.pull(user._id)
            }
            like.save((err,data)=>{
                if(err) console.log(err);
                console.log(data);
                return res.send(like);
                })    
            })
            .catch((error)=>res.status(400).send(error)) 
        })
    },

    getComment: async(req,res,next)=>{
        const post_id = req.params.post_id

        if(!mongoose.Types.ObjectId.isValid(post_id)) return res.status(400).send('wrong post id')
        try{
        const result = await Post.aggregate([
            {$match:{_id: mongoose.Types.ObjectId(post_id)}},            
            {$lookup:{
                from: Comment.collection.name,
                localField: 'comments',
                foreignField: '_id',
                as: 'comments'
            }},            
            {$unwind:"$comments"},
            {$project:{"comments":1}},
            {$lookup:{
                from: User.collection.name,
                localField: 'comments.user',
                foreignField: '_id',
                as: 'comments.user'
            }},
            {$unwind:"$comments.user"},
            {$project:{
                "comments._id":1,
                "comments.user._id":1,
                "comments.user.profile.username":1,
                "comments.user.profile.caption":1,
                "comments.user.profile.profile_pic":1,                
                "comments.caption":1,
                "comments.liked_user":1,
                "comments.replies":1,
                "comments.updatedAt":1,
                "comments.__v":1,
            }},            
            {$lookup:{
                from: Comment.collection.name,
                localField: 'comments.replies',
                foreignField: '_id',
                as: "comments.replies"
            }},
            {$unwind:{path:"$comments.replies", "preserveNullAndEmptyArrays": true}},                        
            {$lookup:{
                from: User.collection.name,
                localField: 'comments.replies.user',
                foreignField: '_id',
                as: 'comments.replies.user'
            }},
            {$unwind:{path:"$comments.replies.user", "preserveNullAndEmptyArrays": true}},  
            {$project:{                                
                "comments.replies.user.publicAddr":0,
                "comments.replies.user.ownerOfNFT":0,
                "comments.replies.user.profile.post_ids":0,
                "comments.replies.user.profile.comment_ids":0,
                "comments.replies.user.profile.points":0,
                "comments.replies.user.profile.liked_user":0,
                "comments.replies.user.__v":0,                                
                "comments.replies.replies":0,
                "comments.replies.createdAt":0,                                
            }},                        
            {$group:{
                _id:"$comments._id",
                "user":{$first:"$comments.user"},
                "caption":{$first:"$comments.caption"},
                "liked_user":{$first:"$comments.liked_user"},
                "updatedAt":{$first:"$comments.updatedAt"},                
                "replies":{$push:"$comments.replies"},
                "__v":{$first:"$comments.__v"}
            }},            
             
        ]).sort({"updatedAt":1})
        console.log(result)        
        
        return res.send(result);
        }catch(error){
            return res.status(400).send(error)
        }
    },

    addComment: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        let {context} = req.body;
        const post_id = req.params.post_id;

        if(!context == undefined || !/([^\s])/.test(context)){            
            return res.status(400).send('Need any character')
        }    

        context = context.replace(/^\s+/g,"")
        context = context.replace(/\s+$/g, "")             

        let user = await User.findOne({publicAddr:publicAddress}).lean()

        console.log('댓글 추가 user Found', user)

        const comment = new Comment({
            user:user._id,
            caption:context,
            replies:[]
        })        

        await Promise.all([User.updateOne({publicAddr:publicAddress},{$addToSet:{'profile.comment_ids':comment._id}}),
        Post.updateOne({_id:post_id},{$addToSet:{comments:comment._id}}),comment.save()])
        .then(()=>{            
            socket.namespace.to(post_id).emit('getNotification', `commentAdded`)
            return res.send('comment added')
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
        let {context} = req.body
        const comment_id = req.params.comment_id

        if(!context == undefined || !/([^\s])/.test(context)){            
            return res.status(400).send('Need any character')
        }    

        context = context.replace(/^\s+/g,"")
        context = context.replace(/\s+$/g, "")   

        User.findOne({publicAddr:publicAddress})
        .then((user)=>{
            if(!user) return res.status(400).send('user not found')
            
            Comment.findOne({_id:comment_id})
             .then(async (comment)=>{
                if(user.id==comment.user.toString()){
                    if(comment.caption=='삭제된 내용입니다.') return res.status(400).send("Deleted comment")                
                    comment.caption=context                         
                    comment.save().then(async ()=>{                        
                    return res.send('comment modified')
                })
            }else{
                return res.status(400).send('not a owner of comment')
            }                        
        }).catch(err=>res.send(err))
        })
    },

    delComment: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress
        const {post_id} = req.body
        const comment_id = req.params.comment_id
        
        try{
        let result = await Promise.all([User.findOne({publicAddr:publicAddress}),
            Comment.findOne({_id:comment_id}), Post.findOne({_id:post_id})])        
        console.log(result)
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
            comment.save()            
        }
        user.profile.comment_ids.pull(comment_id)               

        Promise.all([user.save(),post.save()])                 
        .then(async ()=>{            
            return res.send('message deleted')
        })
        }else{
            return res.status(400).send('not a owner of comment')
        }} catch (err){
        console.log("delComment Promise all error",err)
        return res.status(400).send(err)
    }                        
    },
    addReply : async (req, res, next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        let {context} = req.body;
        const comment_id = req.params.comment_id;

        if(!context == undefined || !/([^\s])/.test(context)){            
            return res.status(400).send('Need any character')
        }    

        context = context.replace(/^\s+/g,"")
        context = context.replace(/\s+$/g, "") 

        let user = await User.findOne({publicAddr:publicAddress})
        let comment = await Comment.findOne({_id:comment_id})
        
        if(comment == null || user == null) return res.status(400).send('comment or user not found')
        
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
        .then(()=>res.send('답글 추가됨'))            
    },

    delReply: async (req,res,next)=>{
        const publicAddress = res.locals.decoded.publicAddress;
        const {reply_id} = req.body;
        const comment_id = req.params.comment_id;

        try{
            const user = await User.findOne({publicAddr:publicAddress}).lean()
            let reply = await Comment.findById(reply_id)
            let comment = await Comment.findById(comment_id).lean()
            
            if(!user | !reply | !comment) return res.status(400).send('not found error')

            let isInArray = comment.replies.some((replyItem)=>{
                return replyItem.equals(reply.id)
            })
            
            if(user._id.toString() == reply.user.toString() && isInArray){            
                reply.caption = '삭제된 내용입니다.'                        
                await reply.save()
            }
            return res.send('reply deleted')
        }catch (error){
            console.log("delReply error", error)
            return res.status(400).send(err)
        }
    },
    getSearch:async (req,res,next)=>{
        const keyword = req.query.keyword
        
        try{
        if(keyword==null || keyword.length<2) return res.status(400).send("Keyword should be at least have 2 characters")

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
        {$limit:10
        },        
        {$lookup:{
            from: User.collection.name,
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        }},
        {$unwind:"$user"},
        {$lookup:{
            from: Like.collection.name,
            localField: 'likes',
            foreignField: '_id',
            as: 'likes'
        }},
        {$unwind:"$likes"},        
        {$project:{            
            "_id": 1,
            "user._id":1,
            "user.profile.username":1,            
            "user.profile.profile_pic":1,
            "createdAt":1,
            "title":1,
            "text":1,
            "comments":1,
            "likes":1,
            score: { $meta: "searchScore" }                
        }
    },
    ])  

    console.log('Search result', result)
    
        return res.send(result)
    }catch(error){
        console.log("Search Error",error)
        return res.status(400).send(error)
    }
    }
}

