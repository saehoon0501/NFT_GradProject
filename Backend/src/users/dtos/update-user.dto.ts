import { IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
  @IsString()
  description: string;

  @IsString()
  username: string;

  @IsUrl()
  profile_pic: string;
}
