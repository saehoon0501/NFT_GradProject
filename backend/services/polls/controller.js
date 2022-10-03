const User = require("../../models/user.model")
const Poll = require("../../models/poll.model")

module.exports = {
    getPoll : (req, res, next) => {            
        let publicAddress
        console.log(req.query.publicAddress)
        if(req.query.userId==undefined){
            publicAddress = res.locals.decoded.publicAddress
        }
    
        
    },
    createPoll : (req, res, next) => {            
        let publicAddress
        console.log(req.query.publicAddress)
        if(req.query.userId==undefined){
            publicAddress = res.locals.decoded.publicAddress

        
    
        
    }
    },
    modifyPoll : (req, res, next) => {            
       
    
        
    },
    deletePoll : (req, res, next) => {            
        let publicAddress
        console.log(req.query.publicAddress)
        if(req.query.userId==undefined){
            publicAddress = res.locals.decoded.publicAddress

    
        
    }
    },  
}