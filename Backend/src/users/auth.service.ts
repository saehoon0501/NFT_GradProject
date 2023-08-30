import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import { User, UserModel } from "./model";
import { JWT_ALGO, JWT_EXPIRE, JWT_SECRET } from "../config/dev";
import jwt from "jsonwebtoken";
import { Service } from "typedi";

@Service()
class AuthService {
  generateNonce() {
    const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    console.log("sending Nonce");
    return randomBytes._hex;
  }

  sndJwt(req, res, next) {
    const { publicAddress, signature, msg } = req.body;

    if (!publicAddress || !signature || !msg)
      return res
        .status(400)
        .send({ error: "Request should have 3 elements(publicAddr, sig, msg" });

    console.log(publicAddress);

    UserModel.findOne({ publicAddr: `${publicAddress}` }).then((user: User) => {
      if (!user) {
        return res.status(401).send({ error: "User not Found" });
      }
      const signedAddr = ethers.utils.verifyMessage(msg, signature);

      if (`${signedAddr.toLowerCase()}` != user.publicAddr) {
        return res.status(401).send({ error: "Signature verification failed" });
      }
      return res.json({
        accessToken: jwt.sign({ publicAddress }, JWT_SECRET, {
          algorithm: JWT_ALGO,
          expiresIn: JWT_EXPIRE,
        }),
      });
    });
  }
}

export { AuthService };
