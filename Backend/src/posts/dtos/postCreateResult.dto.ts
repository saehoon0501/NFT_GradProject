import { Expose, Transform } from "class-transformer";

export class PostCreateDto {
  @Expose()
  result: string;
}
