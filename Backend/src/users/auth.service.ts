import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import { User, UserModel } from "./model";
import { JWT_ALGO, JWT_EXPIRE, JWT_SECRET } from "../config/dev";
import jwt from "jsonwebtoken";
import { Service } from "typedi";

interface jwtInput {
  publicAddress: string;
  signature: string;
  msg: string;
}

@Service()
class AuthService {
  generateNonce() {
    const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    return randomBytes._hex;
  }

  async generateJwt(input: jwtInput) {
    const { publicAddress, signature, msg } = input;
    const user = await UserModel.findOne({ publicAddr: `${publicAddress}` });
    if (!user) {
      return { error: "User not Found" };
    }
    const signedAddr = ethers.utils.verifyMessage(msg, signature);

    if (`${signedAddr.toLowerCase()}` != user.publicAddr) {
      return { error: "Signature verification failed" };
    }
    return {
      accessToken: jwt.sign({ publicAddress }, JWT_SECRET, {
        algorithm: JWT_ALGO,
        expiresIn: JWT_EXPIRE,
      }),
    };
  }
}

export { AuthService };
