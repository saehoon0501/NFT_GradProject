import { ethers } from "ethers";
import { JWT_ALGO, JWT_EXPIRE, JWT_SECRET } from "../config/dev";
import jwt from "jsonwebtoken";
import { Container } from "typedi";
import { IUserRepository } from "./users.repository";
import { Signature } from "ethers";
import { User } from "./model/UserEntity";

interface jwtInput {
  publicAddress: string;
  signature: Signature;
  msg: string;
}

interface IAuthService {
  generateNonce: () => string;
  verifySignature: (input: jwtInput) => Promise<User | undefined>;
  generateJwt: (publicAddress: string, role: string) => object;
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
      return undefined;
    }
    const signedAddr = ethers.utils.verifyMessage(msg, signature);

    if (signedAddr.toLowerCase() !== publicAddress) {
      return undefined;
    }
    return user;
  }

  generateJwt(user_id: string, role: string) {
    return jwt.sign(
      { user_id, admin: role === "admin" ? "true" : "false" },
      JWT_SECRET,
      {
        algorithm: JWT_ALGO,
        expiresIn: JWT_EXPIRE,
      }
    );
  }
}

Container.set("AuthService", new AuthService(Container.get("UserRepository")));

export { IAuthService };
