import { Expose, Transform } from "class-transformer";

export class CommentsDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj.user)
  @Expose()
  user: string;

  @Expose()
  context: string;

  @Transform(({ obj }) => {
    return new Date(obj.createdAt).toLocaleString();
  })
  @Expose()
  createdAt: Date;

  @Transform(({ obj }) => {
    const dateOne = new Date(obj.createdAt);
    const dateTwo = new Date(obj.updatedAt);
    return dateOne.getTime() !== dateTwo.getTime() ? true : false;
  })
  @Expose()
  updated: boolean;

  @Transform(({ obj }) =>
    obj.reply.map((item) => {
      const dateOne = new Date(item.createdAt);
      const dateTwo = new Date(item.updatedAt);
      return {
        _id: item._id,
        user: item.user,
        context: item.context,
        createdAt: new Date(item.createdAt).toLocaleString(),
        updated: dateOne.getTime() !== dateTwo.getTime() ? true : false,
      };
    })
  )
  @Expose()
  reply: object[];
}
