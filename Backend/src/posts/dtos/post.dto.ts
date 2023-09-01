import { IsString } from "class-validator";

export class PostRequestDto {
  @IsString()
  post_id: string;
}
