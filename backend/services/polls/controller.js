const User = require("../../models/user.model")
const Poll = require("../../models/poll.model")

module.exports = {
    getPoll : (req, res, next) => {            
        const poll_id = req.query.pollId
        
        if(poll_id==undefined){
            Poll.find().lean()
            .then((poll)=>{
                if(!poll) return res.status(400).send("Poll not found")
                return res.send(poll)
            })
            .catch((err)=>{
                console.log("getPoll: Poll.find error", err)                
                return res.status(400).send(err)
            })
        }else{
            Poll.findOneById(poll_id).lean()
            .then((poll)=>{
                if(!poll) return res.status(400).send("Poll not found")
                return res.send(poll)
            })
            .catch((err)=>{
                console.log("getPoll: Poll.findOneById error", err)                
                return res.status(400).send(err)
            })
        }        
    },
    createPoll : (req, res, next) => {            
        const {title, options} = req.body
        const publicAddress = res.locals.decoded.publicAddress

        if(!title || !options) return res.status(400).send("Need title, options")

        User.findOne({publicAddr:publicAddress}).lean()
        .then((result)=>{
            if(!result.role || result.role!="admin") return res.status(400).send("Non-Authorized User")
        })

        let ObjectOptions = []

        options.map((option)=>{            
            ObjectOptions.push({name:option})
        })

        //create new poll data
        const newPoll = new Poll({
            "title":title,
            "options":ObjectOptions,
            "votes":[]
        })

        newPoll.save()
        .then((result)=> res.send(result))
        
    },
    deletePoll : (req, res, next) => {            
        const poll_id = req.params.poll_id
        const publicAddress = res.locals.decoded.publicAddress

        if(!poll_id) return res.status(400).send("No poll id")

        User.findOne({publicAddr:publicAddress}).lean()
        .then((result)=>{
            if(!result.role || result.role!="admin") return res.status(400).send("Not Authorized User")
        })

        Poll.deleteOne({_id:poll_id}).lean()
        .then((result)=>res.send(result))        

    },

    votePoll:(req,res,next) => {
        const poll_id = req.params.poll_id
        const {voted_item, user_id, usedNFT} = req.body

        if(!poll_id) return res.status(400).send("No poll id")
        if(!user_id || !usedNFT) return res.status(400).send("Parameter missing")
        if(!voted_item && voted_item!=0) return res.status(400).send("Parameter missing")

        let owner = false

        User.findOne({_id:user_id}).lean()
        .then((result)=>{
            for(let collection of result.ownerOfNFT){
                if(collection.collection_id == usedNFT.collection_id){
                    for(let nft of collection.NFT_URL){
                        if(nft == usedNFT.NFT_URL){
                            console.log('nft',nft == usedNFT.NFT_URL)
                            owner = true                            
                            break
                        }
                    }
                    break
                }
            }
            // result.ownerOfNFT.map((collection)=>{
            //     if(collection.collection_id == usedNFT.collection_id){
            //         collection.NFT_URL.map((nft)=>{                        
            //             if(nft == usedNFT.NFT_URL){
            //                 console.log('nft',nft == usedNFT.NFT_URL)
            //                 owner = true                            
            //             }
            //         })
            //     }                
            // })
            if(!owner) {
                console.log("owner result2", owner)
                return res.status(400).send("Not an owner of NFT")
            }

            Poll.findOne({_id:poll_id})
            .then((result)=>{            
                if(result== null) return res.status(400).send("Poll not found")

                result.votes.map((vote)=>{
                    if(vote.usedNFT.NFT_URL == usedNFT.NFT_URL){
                        return res.status(400).send("NFT already used")
                    }
                })
            
                result.votes.push({user_id,usedNFT})            

                if(!result.options[voted_item]) return res.status(400).send("Invalid Vote option")
            
                result.options[voted_item].vote_count += 1
                result.save()
                .then(()=>res.send(result))
            })
        })                    
    }
}