import { Container } from "typedi";
Container.set("PostRepository", {});
Container.set("LikeRepository", {});
Container.set("CommentRepository", {});
import "./posts.service";
import { IPostService } from "./posts.service";

const postService = Container.get("PostService") as IPostService;

describe("post title sanitation test", () => {
  it("when title is empty", () => {
    const input = "";
    expect(postService.sanitize(input)).toStrictEqual("Need any character");
  });

  it("when title has whitespaces in front of the line", () => {
    const input = "  abc";
    expect(postService.sanitize(input)).toStrictEqual("abc");
  });

  it("when title has whitespaces in back of the line", () => {
    const input = "abc  ";
    expect(postService.sanitize(input)).toStrictEqual("abc");
  });

  it("when title has whitespaces in both front and back of the line", () => {
    const input = "   abc  ";
    expect(postService.sanitize(input)).toStrictEqual("abc");
  });
});
