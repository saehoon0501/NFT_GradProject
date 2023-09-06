import { IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
  @IsString()
  description: string;

  @IsString()
  username: string;

  @IsString()
  profile_pic: string;
}
