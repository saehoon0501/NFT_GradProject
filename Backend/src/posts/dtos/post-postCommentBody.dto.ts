import { IsString } from "class-validator";

export class PostCommentBodyDto {
  @IsString()
  context: string;
}
