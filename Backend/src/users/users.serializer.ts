import { plainToInstance } from "class-transformer";
import Container from "typedi";

interface ClassConstructor {
  new (...args: any[]): object;
}

class UpdatedResult {
  matchedCount: number;
}

abstract class UserSerializer {
  serializeUser: (dto: ClassConstructor, data: object) => object;
  serializeUserItems: (dto: ClassConstructor, data: object) => object;
  serializeUserUpdate: (data: UpdatedResult) => boolean;
}

class MongoUserSerializer implements UserSerializer {
  serializeUser(dto: ClassConstructor, data: object) {
    return plainToInstance(dto, data, {
      excludeExtraneousValues: true,
    });
  }

  serializeUserItems(dto: ClassConstructor, data: object) {
    return this.getItems(data).map((post: object) => {
      return plainToInstance(dto, post, {
        excludeExtraneousValues: true,
      });
    });
  }

  serializeUserUpdate(data: UpdatedResult) {
    if (data.matchedCount == 0) {
      return true;
    }
    return false;
  }

  private getItems(data: object) {
    if (data[0].posts) {
      return data[0].posts;
    } else if (data[0].comments) {
      return data[0].comments;
    }
    return [];
  }
}

Container.set("UserSerializer", new MongoUserSerializer());

export { UserSerializer };
