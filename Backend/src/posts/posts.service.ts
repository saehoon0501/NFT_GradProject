import { Container, Service } from "typedi";
import { Post } from "./model";

interface IPostService {
  getBestPosts: (lastWeek: Date, pageNum: number) => Object;
  getPosts: (pageNum: number) => Object;
  sanitize: (post_title: string) => string;
  createPost;
}

@Service()
class PostService implements IPostService {
  constructor(private postRepository: IPostService) {}
  getBestPosts(lastWeek: Date, pageNum: number) {
    return this.postRepository.getBestPosts(lastWeek, pageNum);
  }
  getPosts(pageNum: number) {
    return this.postRepository.getPosts(pageNum);
  }

  sanitize(post_title: string) {
    let result = post_title;
    if (result == undefined || !/([^\s])/.test(result)) {
      return "Need title";
    }
    result = result.replace(/^\s+/g, "");
    result = result.replace(/\s+$/g, "");

    return result;
  }

  createPost(aPost: Post) {
    console.log(aPost);
    return this.postRepository.createPost(aPost);
  }
}

Container.set("PostService", new PostService(Container.get("PostRepository")));

export { IPostService };
