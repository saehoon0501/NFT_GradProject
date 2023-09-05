import { Expose, Transform } from "class-transformer";

export class CommentCreateDto {
  @Transform(({ obj }) => (obj._id ? "ok" : "failed"))
  @Expose()
  result: string;
}
