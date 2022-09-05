const User = require("../../models/user.model");
const {Post,Like,Comment} = require('../../models/post.model');


module.exports = {
    sndProfile : (req, res, next) => {
        const publicAddress = res.locals.decoded.publicAddress;

        User.findOne({publicAddr:`${publicAddress}`})
        .then((user)=>{
            if(!user){
                return res.status(401).send({error: 'User not Found'});
            }
            console.log('sndProfile 실행 결과', user);
            return res.json(user);
        })
    },
    updateProfile : (req, res, next) => {
        const publicAddress = res.locals.decoded.publicAddress;

        const {caption, profileName, profile_pic} = req.body;

        if(caption || profileName){
            User.updateOne({
                publicAddr:`${publicAddress}`
            },
            {
                $set:{"profile.username":`${profileName}`, "profile.caption":`${caption}`}
            }).then((result)=>{
                console.log('updateProfile 실행 결과', result)
                return res.send("user info updated")
            });
        }

        if(profile_pic){
            User.findOneAndUpdate({
                $and :[
                {publicAddr:`${publicAddress}`},
                {"ownerOfNFT.NFT_URL":`${profile_pic}`}
            ]},{
                $set:{"profile.profile_pic":`${profile_pic}`}
            }).then(()=>{return res.send("user info updated")});
        }
    },
    getUserPost : (req, res, next) => {
        const publicAddress = res.locals.decoded.publicAddress;

        User.findOne({publicAddr:publicAddress}).populate('profile.post_ids','',Post).lean()
        .then((user)=>{
            if(!user) return res.status(400).send('user not found')
            console.log('user Post', user)
            return res.send(user.profile.post_ids)
        })
        
    },
    getUserComment : (req, res, next) => {
        const publicAddress = res.locals.decoded.publicAddress;

        User.findOne({publicAddr:publicAddress}).populate('profile.comment_ids','',Comment).lean()
        .then((user)=>{              
            if(!user) return res.status(400).send('user not found')
                        
            console.log('getUserComment 실행 결과', user.profile.comment_ids)
            return res.send(user.profile.comment_ids)
        })
    }
}