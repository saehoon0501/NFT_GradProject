import { IsString, Length } from "class-validator";

export class CreatePostRequestDto {
  @IsString()
  @Length(1)
  post_title: string;

  @IsString()
  post_text: string;
}
