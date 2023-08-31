import { Container } from "typedi";
Container.set("UserRepository", {
  findByPublicAddress: jest.fn(() => {
    return { publicAddr: "0xbe38d61731fb86d9a981f38f1bd73b106e80ce32" };
  }),
});
import "./auth.service";
import { IAuthService } from "./auth.service";

let input;
const authService: IAuthService = Container.get("AuthService");

describe("Mocking UserRepo", () => {
  beforeEach(() => {
    input = {
      publicAddress: "0xbe38d61731fb86d9a981f38f1bd73b106e80ce32",
      signature:
        "0xcebaa9186a7133ea5e5af7a804cd475b67b890a58bb027618393be716c8bb03e1816ad62833b83801fe554757dd4c89be12c921bde007c6d25ebd80b34c6e7b21b",
      msg: "I am signing my one-time Nonce: 0x1b25bd91775a59803fadb29e8447db344395991e2be16113eec4e7524bd26745",
    };
  });
  test("checking signature is valid", async () => {
    expect(await authService.verifySignature(input)).toEqual(true);
  });

  test("When input is invalid", async () => {
    input.publicAddress = "731fb86d9a981f";
    expect(await authService.verifySignature(input)).toEqual(false);
  });
});
