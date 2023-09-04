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
}

class MongoPostSerializer extends PostSerializer {
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
}

Container.set("PostSerializer", new MongoPostSerializer());

export { PostSerializer };
