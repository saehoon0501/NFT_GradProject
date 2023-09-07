import { IsString, MinLength } from "class-validator";

export class GetUserDto {
  @IsString()
  @MinLength(10)
  user_id: string;
}
