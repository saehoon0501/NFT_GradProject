"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = require("../users/model");
const ethers_1 = require("ethers");
const config_1 = __importDefault(require("../../config"));
module.exports = {
    sndNonce: (req, res, next) => {
        const randomBytes = ethers_1.ethers.BigNumber.from(ethers_1.ethers.utils.randomBytes(32));
        console.log("sending Nonce");
        return res.send(randomBytes._hex);
    },
    sndJwt: (req, res, next) => {
        const { publicAddress, signature, msg } = req.body;
        if (!publicAddress || !signature || !msg)
            return res
                .status(400)
                .send({ error: "Request should have 3 elements(publicAddr, sig, msg" });
        model_1.UserModel.findOne({ publicAddr: `${publicAddress}` }).then((user) => {
            if (!user) {
                return res.status(401).send({ error: "User not Found" });
            }
            const signedAddr = ethers_1.ethers.utils.verifyMessage(msg, signature);
            if (`${signedAddr.toLowerCase()}` != user.publicAddr) {
                return res.status(401).send({ error: "Signature verification failed" });
            }
            return res.json({
                accessToken: jsonwebtoken_1.default.sign({ publicAddress }, config_1.default.secretKey, config_1.default.options),
            });
        });
    },
};
