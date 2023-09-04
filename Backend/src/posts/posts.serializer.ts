import Container from "typedi";
import { Post } from "./model";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
  new (...args: any[]): object;
}

interface PostSerializer {
  serializePosts: (dto: ClassConstructor, data: object[]) => object;
}

class MongoPostSerializer implements PostSerializer {
  serializePosts(dto: ClassConstructor, data: object[]) {
    return data.map((post) =>
      plainToInstance(dto, post, {
        excludeExtraneousValues: true,
      })
    );
  }
}

Container.set("PostSerializer", new MongoPostSerializer());

export { PostSerializer };
