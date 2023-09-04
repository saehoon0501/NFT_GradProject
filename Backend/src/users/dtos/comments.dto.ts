import { Expose, Transform } from "class-transformer";

export class CommentDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  id: string;

  @Transform(({ obj }) => obj.user)
  @Expose()
  user: string;

  @Expose()
  context: string;
}
