import Container from "typedi";
import { Serializer } from "../serializer/serializer";
import { PostsDto } from "./dtos/posts.dto";
import { PostCreateDto } from "./dtos/postCreateResult.dto";
import { CommentsDto } from "./dtos/comments.dto";

abstract class PostSerializer extends Serializer {
  abstract serializePosts(data: object[]): object[];
  abstract serializeCreatePost(data: object): object;
  abstract serializeDelete(data: object): boolean;
  abstract serializePostComments(data: object[]): object;
  abstract serializeCreateComment(data: object): object;
  abstract serializeUpdate(data: object): boolean;
}

class UpdatedResult {
  matchedCount: number;
}

class MongoPostSerializer extends PostSerializer {
  serializeCreateComment(data: object): object {
    throw new Error("Method not implemented.");
  }
  serializeDelete(data: object): boolean {
    throw new Error("Method not implemented.");
  }
  serializePostComments(data: object[]): object {
    return this.serializeItems(CommentsDto, data);
  }
  serializePosts(data: object[]): object[] {
    return this.serializeItems(PostsDto, data);
  }

  serializeCreatePost(data: object): object {
    return this.serializeItem(PostCreateDto, data);
  }

  serializeUpdate(data: UpdatedResult) {
    if (data.matchedCount == 0) {
      return true;
    }
    return false;
  }
}

Container.set("PostSerializer", new MongoPostSerializer());

export { PostSerializer };
