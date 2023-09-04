import Container from "typedi";
import { User } from "./model/UserEntity";
import { IUserRepository } from "./users.repository";

interface IUserService {
  getUser: (uniqueKey: string) => Promise<User>;
  getUserPosts: (user_id: string) => any;
  getUserComments: (user_id: string) => any;
  updateUser: (
    user_id: string,
    {
      description,
      username,
      profile_pic,
    }: {
      description: string;
      username: string;
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

  getUserPosts(user_id: string) {
    return this.userRepo.getUserPosts(user_id);
  }

  getUserComments(user_id: string) {
    return this.userRepo.getUserComments(user_id);
  }

  updateUser(
    user_id: string,
    {
      description,
      username,
      profile_pic,
    }: {
      description: string;
      username: string;
      profile_pic: string;
    }
  ) {
    return this.userRepo.updateUser(user_id, {
      description,
      username,
      profile_pic,
    });
  }
}

Container.set("UserService", new UserSerivce(Container.get("UserRepository")));

export { IUserService };
