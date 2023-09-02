import { IsString } from "class-validator";

export class PostReplyCommentDto {
  @IsString()
  comment_id: string;
}
