import { IsString } from "class-validator";

export class GetSendPostDto {
  @IsString()
  filter: string;

  @IsString()
  pageNum: number;
}
