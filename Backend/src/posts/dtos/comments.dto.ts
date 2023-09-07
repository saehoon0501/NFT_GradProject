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

  @Transform(({ obj }) => {
    console.log(obj.like.liked_user);
    return obj.like.liked_user.some((user) => {
      if (typeof user === "object") {
        return user.equals(obj.requester);
      }
      return user === obj.requester;
    });
  })
  @Expose()
  liked_user: boolean;

  @Transform(({ obj }) => obj.like.liked_num)
  @Expose()
  like_num: number;

  @Transform(({ obj }) =>
    obj.reply_like.map((like) => {
      return {
        liked_num: like.liked_num,
        liked_user: like.liked_user.some((user) => {
          if (typeof user === "object") {
            return user.equals(obj.requester);
          }
          return user === obj.requester;
        }),
      };
    })
  )
  @Expose()
  reply_like: object[];
}
