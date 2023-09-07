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

  @Transform(({ obj }) => obj.updatedAt)
  @Expose()
  updatedAt: Date;

  @Transform(({ obj }) =>
    obj.reply.map((item) => {
      return {
        _id: item._id,
        user: item.user,
        context: item.context,
        updatedAt: item.updatedAt,
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
  liked_num: number;

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
  reply_likes: object[];
}
