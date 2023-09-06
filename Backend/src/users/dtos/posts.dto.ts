import { Expose, Transform } from "class-transformer";

export class PostDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj.posts.user)
  @Expose()
  user: string;

  @Transform(({ obj }) => obj.posts.title)
  @Expose()
  title: string;

  @Transform(({ obj }) => obj.posts.text)
  @Expose()
  text: string;
}
