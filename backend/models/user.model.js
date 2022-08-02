const mongoose =  require(`mongoose`);
const Schema = mongoose.Schema;

const nftDb = mongoose.createConnection("mongodb://localhost:27017/NFTdb")

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
        profile_pic : {type:String}
    }
});

module.exports = nftDb.model('user', userSchema);