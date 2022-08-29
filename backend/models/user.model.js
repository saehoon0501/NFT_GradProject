const mongoose =  require(`mongoose`);
const Schema = mongoose.Schema;
const config = require('../config')

const nftDb = mongoose.createConnection(config.mongoPath)

const userSchema = new Schema({
    publicAddr :{
        type: String,
        required: true,
        unique: true
    },
    ownerOfNFT :[
            {
                collection_id: {type:String},
                NFT_URL : [String]
            }
    ],
    profile :{
        username: {type:String},
        caption : {type:String},
        points : {type:Number},
        post_ids : [{type: Schema.Types.ObjectId, ref:`post`}],
        comments_ids: [{type: Schema.Types.ObjectId, ref:`comment`}],
        likes_ids: [{type: Schema.Types.ObjectId, ref:`like`}],
        profile_pic : {type:String}
    }
});

module.exports = nftDb.model('user', userSchema);