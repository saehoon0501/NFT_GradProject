import { IsString, MinLength } from "class-validator";

export class GetSearchDto {
  @IsString()
  @MinLength(2)
  keyword: string;
}
