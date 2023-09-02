import { IsString } from "class-validator";

export class PostLikePostDto {
  @IsString()
  post_id: string;
}
