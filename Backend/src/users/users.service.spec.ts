import { Container } from "typedi";
import { IUserRepository } from "./users.repository";
Container.set("UserRepository", {
  findById: jest.fn((user_id) => {
    return {
      _id: user_id,
      public_address: "public_address",
      owner_of_nft: [],
      username: "username",
      description: "description",
      points: 0,
      profile_pic: "",
      role: "user",
    };
  }),
  findByPublicAddress: jest.fn((public_address) => {
    return {
      _id: "user_id",
      public_address: public_address,
      owner_of_nft: [],
      username: "username",
      description: "description",
      points: 0,
      profile_pic: "",
      role: "user",
    };
  }),
});
import "./users.service";
import { IUserService } from "./users.service";

const userService = Container.get("UserService") as IUserService;

describe("Checking getUser based on parameter", () => {
  it("If it is user id", () => {
    const user_id = "64f73a25fa761dc3da613751";
    const mockedUserRepo = Container.get("UserRepository") as IUserRepository;

    expect(userService.getUser(user_id)).toStrictEqual({
      _id: "64f73a25fa761dc3da613751",
      public_address: "public_address",
      owner_of_nft: [],
      username: "username",
      description: "description",
      points: 0,
      profile_pic: "",
      role: "user",
    });
    expect(mockedUserRepo.findById).toHaveBeenCalled();
  });

  it("If it is public address", () => {
    const public_address = "0x99bd9677C44c5D8bD813e187f72b1014d53e968B";
    const mockedUserRepo = Container.get("UserRepository") as IUserRepository;

    expect(userService.getUser(public_address)).toStrictEqual({
      _id: "user_id",
      public_address: "0x99bd9677C44c5D8bD813e187f72b1014d53e968B",
      owner_of_nft: [],
      username: "username",
      description: "description",
      points: 0,
      profile_pic: "",
      role: "user",
    });
    expect(mockedUserRepo.findByPublicAddress).toHaveBeenCalled();
  });
});
