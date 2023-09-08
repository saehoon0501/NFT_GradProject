import { IsString } from "class-validator";

export class GetRepliesDto {
  @IsString()
  comment_id: string;
}
