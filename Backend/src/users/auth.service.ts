import { ethers } from "ethers";
import { JWT_ALGO, JWT_EXPIRE, JWT_SECRET } from "../config/dev";
import jwt from "jsonwebtoken";
import { Container } from "typedi";
import { IUserRepository } from "./users.repository";
import { Signature } from "ethers";

interface jwtInput {
  publicAddress: string;
  signature: Signature;
  msg: string;
}

interface IAuthService {
  generateNonce: () => string;
  verifySignature: (input: jwtInput) => Promise<boolean>;
  generateJwt: (publicAddress: string) => { accessToken };
}

class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepository) {}

  generateNonce() {
    const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    return randomBytes._hex;
  }

  async verifySignature(input: jwtInput) {
    const { publicAddress, signature, msg } = input;
    const user = await this.userRepo.findByPublicAddress(publicAddress);

    if (!user) {
      return false;
    }
    const signedAddr = ethers.utils.verifyMessage(msg, signature);

    if (signedAddr.toLowerCase() !== publicAddress) {
      return false;
    }
    return true;
  }

  generateJwt(publicAddress: string) {
    return {
      accessToken: jwt.sign({ publicAddress }, JWT_SECRET, {
        algorithm: JWT_ALGO,
        expiresIn: JWT_EXPIRE,
      }),
    };
  }
}

Container.set("AuthService", new AuthService(Container.get("UserRepository")));

export { IAuthService };
