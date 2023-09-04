import { Expose, Transform } from "class-transformer";

export class PostDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  id: string;

  @Transform(({ obj }) => obj.user)
  @Expose()
  user: string;

  @Expose()
  title: string;

  @Expose()
  text: string;
}
