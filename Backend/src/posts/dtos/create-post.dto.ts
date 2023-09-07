import { IsArray, IsObject, IsString, Length } from "class-validator";

export class CreatePostRequestDto {
  @IsString()
  @Length(1)
  post_title: string;

  @IsObject()
  post_text: object;
}
