import { IsString, IsUrl } from "class-validator";

export class UpdateUserDto {
  @IsString()
  caption: string;

  @IsString()
  profileName: string;

  @IsUrl()
  profile_pic: string;
}
