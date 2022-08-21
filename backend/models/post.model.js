const mongoose =  require(`mongoose`);
const Schema = mongoose.Schema;
const User = require('./user.model');

const postDb = mongoose.createConnection("mongodb://localhost:27017/Postdb")

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
    comments:{
        type: Schema.Types.ObjectId, ref: 'comment'
    }
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
    comments:[{
        user:{
            type: Schema.Types.ObjectId, ref:'user'
        },
        caption:{
            type:String
        },        
        liked_user:[{
            type: Schema.Types.ObjectId, ref:'user'  
        }],
        reply:[{
            user:{
                type: Schema.Types.ObjectId, ref:'user'
            },
            caption:{
                type:String
            },            
            liked_user:[{
                type: Schema.Types.ObjectId, ref:'user'  
            }],            
        }]
    }]
})

module.exports.Post = mongoose.model('post', postSchema);
module.exports.Like = mongoose.model('like', likeSchema);
module.exports.Comment = mongoose.model('comment', commentSchema);

