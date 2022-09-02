const mongoose =  require(`mongoose`);
const Schema = mongoose.Schema;
const config = require('../config');

const postDb = mongoose.createConnection(config.mongoPath)

const postSchema = new Schema({
    user:{
       type: Schema.Types.ObjectId, ref: 'user', required: true
    },
    title:{
        type: String, required:true
    },
    text:{
        type: String
    },
    likes:{
        type: Schema.Types.ObjectId, ref: 'like'
    },
    comments:[{
        type: Schema.Types.ObjectId, ref: 'comment'
    }]
},{timestamps: true});

const likeSchema = new Schema({
    liked_num :{
        type: Number, default: 0
    },
    liked_user:[{
      type: Schema.Types.ObjectId, ref:'user'  
    }]
})

const commentSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId, ref:'user'
    },
    caption:{
        type:String
    },        
    liked_user:[{
        type: Schema.Types.ObjectId, ref:'user'  
    }],
    replies:[{
        type: Schema.Types.ObjectId, ref:'comment'
    }] 
})

module.exports.Post = postDb.model('post', postSchema);
module.exports.Like = postDb.model('like', likeSchema);
module.exports.Comment = postDb.model('comment', commentSchema);

