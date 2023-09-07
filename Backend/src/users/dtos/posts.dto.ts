import { Expose, Transform } from "class-transformer";

export class PostDto {
  @Transform(({ obj }) => obj.posts._id)
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj._id)
  @Expose()
  user: string;

  @Transform(({ obj }) => obj.posts.title)
  @Expose()
  title: string;

  @Transform(({ obj }) => obj.posts.text)
  @Expose()
  text: string;

  @Transform(({ obj }) => obj.likes.liked_num)
  @Expose()
  liked_num: number;

  @Transform(({ obj }) => obj.comments.length)
  @Expose()
  comments: number;
}
