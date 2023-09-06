import { Expose, Transform } from "class-transformer";

export class CommentDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj.comments.user)
  @Expose()
  user: string;

  @Transform(({ obj }) => obj.comments.context)
  @Expose()
  context: string;
}
