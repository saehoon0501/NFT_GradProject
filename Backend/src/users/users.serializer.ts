import Container from "typedi";
import { Serializer } from "../serializer/serializer";
import { UserDto } from "./dtos/user.dto";
import { PostDto } from "./dtos/posts.dto";
import { ProfileDto } from "./dtos/profile.dto";
import { CommentDto } from "./dtos/comments.dto";

class UpdatedResult {
  matchedCount: number;
}

abstract class UserSerializer extends Serializer {
  abstract serializeUser(data: object): object;
  abstract serializeProfile(data: object): object;
  abstract serializeUserPosts(data: object[]): object;
  abstract serializeUserComments(data: object[]): object;
  abstract serializeUserUpdate(data: UpdatedResult): boolean;
}

class MongoUserSerializer extends UserSerializer {
  serializeUser(data: object) {
    return this.serializeItem(UserDto, data);
  }
  serializeProfile(data: object): object {
    return this.serializeItem(ProfileDto, data);
  }

  serializeUserPosts(data: object[]) {
    return this.serializeItems(PostDto, data);
  }

  serializeUserComments(data: object[]) {
    return this.serializeItems(CommentDto, data);
  }

  serializeUserUpdate(data: UpdatedResult) {
    if (data.matchedCount == 0) {
      return true;
    }
    return false;
  }
}

Container.set("UserSerializer", new MongoUserSerializer());

export { UserSerializer };
