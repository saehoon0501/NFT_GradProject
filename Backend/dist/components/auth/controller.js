"use strict";
const jwt = require("jsonwebtoken");
const User = require("../users/user.model");
const ethers = require("ethers");
const config = require("../../config");
module.exports = {
    sndNonce: (req, res, next) => {
        const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
        return res.send(randomBytes._hex);
    },
    sndJwt: (req, res, next) => {
        const { publicAddress, signature, msg } = req.body;
        if (!publicAddress || !signature || !msg)
            return res
                .status(400)
                .send({ error: "Request should have 3 elements(publicAddr, sig, msg" });
        User.findOne({ publicAddr: `${publicAddress}` }).then((usr) => {
            if (!usr) {
                return res.status(401).send({ error: "User not Found" });
            }
            const signedAddr = ethers.utils.verifyMessage(msg, signature);
            if (`${signedAddr.toLowerCase()}` != usr.publicAddr) {
                return res.status(401).send({ error: "Signature verification failed" });
            }
            return res.json({
                accessToken: jwt.sign({ publicAddress }, config.secretKey, config.options),
            });
        });
    },
};
