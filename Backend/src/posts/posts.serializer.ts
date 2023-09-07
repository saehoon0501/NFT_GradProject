import Container from "typedi";
import { Serializer } from "../serializer/serializer";
import { PostsDto } from "./dtos/posts.dto";
import { PostCreateDto } from "./dtos/postCreateResult.dto";
import { CommentsDto } from "./dtos/comments.dto";
import { DeleteDto } from "./dtos/postDeleteResult.dto";
import { CommentCreateDto } from "./dtos/commentCreateResult.dto";
import { SearchDto } from "./dtos/searchResult.dto";

abstract class PostSerializer extends Serializer {
  abstract serializePosts(data: any[], user_id: string): object[];
  abstract serializeCreatePost(data: object): object;
  abstract serializeDelete(data: object): object;
  abstract serializePostComments(data: any[], user_id: string): object;
  abstract serializeCreateComment(data: object): object;
  abstract serializeUpdate(data: object): boolean;
  abstract serializeSearch(data: object[]): object;
}

class UpdatedResult {
  matchedCount: number;
}

class MongoPostSerializer extends PostSerializer {
  serializeSearch(data: object[]): object {
    return this.serializeItems(SearchDto, data);
  }
  serializeCreateComment(data: object): object {
    return this.serializeItem(CommentCreateDto, data);
  }

  serializeDelete(data: object): object {
    return this.serializeItem(DeleteDto, data);
  }
  serializePostComments(data: any[], user_id: string): object {
    return this.serializeItems(
      CommentsDto,
      data.map((comment) => {
        comment.requester = user_id;
        console.log(comment);
        return comment;
      })
    );
  }
  serializePosts(data: any[], user_id: string): object[] {
    return this.serializeItems(
      PostsDto,
      data.map((post) => {
        post.requester = user_id;
        return post;
      })
    );
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
