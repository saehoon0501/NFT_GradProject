import { IsString, Min } from "class-validator";

export class PostAuthDto {
  @IsString()
  publicAddress: string;

  @IsString()
  signature: string;

  @IsString()
  msg: string;
}
