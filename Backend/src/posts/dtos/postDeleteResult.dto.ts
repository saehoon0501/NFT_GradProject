import { Expose } from "class-transformer";

export class DeleteDto {
  @Expose()
  result: object;
}
