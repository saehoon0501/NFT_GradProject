const User = require("../../models/user.model");


module.exports = {
    sndProfile : (req, res, next) => {
        const publicAddress = res.locals.decoded.publicAddress;

        User.findOne({publicAddr:`${publicAddress}`})
        .then((usr)=>{
            if(!usr){
                return res.status(401).send({error: 'User not Found'});
            }
            console.log(usr);
            return res.json(usr);
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
                console.log(result)
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
            }).then(()=>{return res.send("profile_pic updated")});
        }
    }
}