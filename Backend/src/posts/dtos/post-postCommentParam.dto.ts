import { IsString } from "class-validator";

export class PostCommentParamDto {
  @IsString()
  context: string;
}
