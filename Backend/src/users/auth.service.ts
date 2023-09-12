import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { Container } from "typedi";
import { IUserRepository } from "./users.repository";
import { Signature } from "ethers";
import { User } from "./model/UserEntity";
import { ICacheRepository, redisClient } from "../cache/cache";
const keys = require("../config/keys");

interface jwtInput {
  publicAddress: string;
  signature: string;
  msg: string;
}

interface IAuthService {
  generateNonce: () => string;
  verifySignature: (input: jwtInput) => boolean;
  generateJwt: (publicAddress: string, role: string) => object;
  getUser(publicAddress: string): Promise<User>;
  createUser(publicAddress: string): Promise<User>;
  addToBlackList(token: string, expire: number): void;
}

class AuthService implements IAuthService {
  constructor(
    private repository: IUserRepository,
    private cacheRepository: ICacheRepository
  ) {}
  addToBlackList(token: string, expire: number): void {
    this.cacheRepository.addToBlackList(token, expire);
  }

  generateNonce() {
    const randomBytes = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    return randomBytes._hex;
  }

  getUser(publicAddress: string): Promise<User> {
    return this.repository.findByPublicAddress(publicAddress);
  }

  createUser(publicAddress: string): Promise<User> {
    return this.repository.createUser(publicAddress);
  }

  verifySignature(input: jwtInput) {
    const { publicAddress, signature, msg } = input;
    const signedAddress = ethers.utils.verifyMessage(msg, signature);

    if (signedAddress.toLowerCase() !== publicAddress) {
      return false;
    }
    return true;
  }

  generateJwt(user_id: string, role: string) {
    return jwt.sign(
      { user_id, admin: role === "admin" ? "true" : "false" },
      keys.JWT_SECRET,
      {
        algorithm: keys.JWT_ALGO,
        expiresIn: keys.JWT_EXPIRE,
      }
    );
  }
}

Container.set(
  "AuthService",
  new AuthService(
    Container.get("UserRepository"),
    Container.get("CacheRepository")
  )
);

export { IAuthService };
