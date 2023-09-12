import { Container } from "typedi";
import { IUserRepository } from "./users.repository";
import { ICacheRepository } from "../cache/cache";
const userRepo = Container.set("UserRepository", {} as IUserRepository);
const redis = Container.set("CacheRepository", {} as ICacheRepository);
import { IAuthService } from "./auth.service";
import "./auth.service";

let input;
const authService: IAuthService = Container.get("AuthService");
Container.set("UserRepository", userRepo);

describe("Stubbing UserRepo", () => {
  beforeEach(() => {});

  test("checking signature is valid", async () => {
    input = {
      publicAddress: "0xbe38d61731fb86d9a981f38f1bd73b106e80ce32",
      signature:
        "0xcebaa9186a7133ea5e5af7a804cd475b67b890a58bb027618393be716c8bb03e1816ad62833b83801fe554757dd4c89be12c921bde007c6d25ebd80b34c6e7b21b",
      msg: "I am signing my one-time Nonce: 0x1b25bd91775a59803fadb29e8447db344395991e2be16113eec4e7524bd26745",
    };
    expect(await authService.verifySignature(input)).toEqual(true);
  });

  test("When input is invalid", async () => {
    input = {
      publicAddress: "0x99bd9677C44c5D8bD813e187f72b1014d53e968B",
      signature:
        "0xcebaa9186a7133ea5e5af7a804cd475b67b890a58bb027618393be716c8bb03e1816ad62833b83801fe554757dd4c89be12c921bde007c6d25ebd80b34c6e7b21b",
      msg: "I am signing my one-time Nonce: 0x1b25bd91775a59803fadb29e8447db344395991e2be16113eec4e7524bd26745",
    };
    expect(await authService.verifySignature(input)).toEqual(false);
  });
});
