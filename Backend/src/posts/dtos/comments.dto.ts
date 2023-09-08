import { Expose, Transform } from "class-transformer";

export class CommentsDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  _id: string;

  @Transform(({ obj }) => obj.user)
  @Expose()
  user: object;

  @Expose()
  context: string;

  @Transform(({ obj }) => obj.updatedAt)
  @Expose()
  updatedAt: Date;

  @Transform(({ obj }) => {
    if (obj.reply[0].like) {
      return obj.reply.map((item) => {
        const liked_user = getLikedUser(item.like.liked_user, obj.requester);
        return {
          _id: item._id,
          user: item.user,
          context: item.context,
          updatedAt: item.updatedAt,
          like: { liked_num: item.like.liked_num, liked_user },
        };
      });
    }
    return [];
  })
  @Expose()
  reply: object[];

  @Transform(({ obj }) => getLikedUser(obj.like.liked_user, obj.requester))
  @Expose()
  liked_user: boolean;

  @Transform(({ obj }) => obj.like.liked_num)
  @Expose()
  liked_num: number;
}

function getLikedUser(liked_user: object[] | string[], requester: string) {
  return liked_user.some((user) => {
    if (typeof user === "object") {
      return user.equals(requester);
    }
    return user === requester;
  });
}
