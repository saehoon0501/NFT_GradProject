import { IsString } from "class-validator";

export class PostCommentParamDto {
  @IsString()
  post_id: string;
}
