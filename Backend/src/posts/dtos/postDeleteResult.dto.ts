import { Expose, Transform } from "class-transformer";

export class DeleteDto {
  @Transform(({ obj }) => {
    if (obj.result === "OK") {
      return obj;
    } else {
      return { result: "falied" };
    }
  })
  @Expose()
  result: object;
}
