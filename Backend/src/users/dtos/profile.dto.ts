import { Expose, Transform } from "class-transformer";

export class ProfileDto {
  @Expose()
  id: string;

  @Expose()
  role: number;

  @Expose()
  description: string;

  @Expose()
  points: string;

  @Expose()
  profile_pic: number;

  @Expose()
  username: number;
}
