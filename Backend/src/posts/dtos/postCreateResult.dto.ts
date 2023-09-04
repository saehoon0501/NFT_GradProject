import { Expose, Transform } from "class-transformer";

export class PostCreateDto {
  @Transform(({ obj }) => (obj._id ? "post created" : "post not created"))
  @Expose()
  result: string;
}
