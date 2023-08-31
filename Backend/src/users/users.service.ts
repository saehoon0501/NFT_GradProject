import Container from "typedi";
import { User } from "./model/UserEntity";
import { IUserRepository } from "./users.repository";

interface IUserService {
  getUser: (uniqueKey: string) => User;
  getUserPosts: (publicAddress: string) => any;
  getUserComments: (publicAddress: string) => any;
  updateUser: (
    publicAddress: string,
    {
      caption,
      profileName,
      profile_pic,
    }: {
      caption: string;
      profileName: string;
      profile_pic: string;
    }
  ) => any;
}

class UserSerivce implements IUserService {
  constructor(private userRepo: IUserRepository) {}

  getUser(uniqueKey: string) {
    if (uniqueKey.length >= 30) {
      return this.userRepo.findByPublicAddress(uniqueKey);
    }
    return this.userRepo.findById(uniqueKey);
  }

  getUserPosts(publicAddress: string) {
    return this.userRepo.getUserPosts(publicAddress);
  }

  getUserComments(publicAddress: string) {
    return this.userRepo.getUserComments(publicAddress);
  }

  updateUser(
    publicAddress: string,
    {
      caption,
      profileName,
      profile_pic,
    }: {
      caption: string;
      profileName: string;
      profile_pic: string;
    }
  ) {
    return this.userRepo.updateUser(publicAddress, {
      caption,
      profileName,
      profile_pic,
    });
  }
}

Container.set("UserService", new UserSerivce(Container.get("UserRepository")));

export { IUserService };
