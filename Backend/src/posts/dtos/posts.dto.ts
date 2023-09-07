import { Expose, Transform } from "class-transformer";

export class PostsDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  post_id: string;

  @Transform(({ obj }) => {
    return {
      _id: obj.user._id,
      username: obj.user.username,
      profile_pic: obj.user.profile_pic,
    };
  })
  @Expose()
  user: object;

  @Expose()
  title: string;

  @Expose()
  text: string;

  @Transform(({ obj }) => {
    const like = obj.likes;
    return {
      liked_num: like.liked_num,
      liked_user: like.liked_user.some((user) => {
        if (typeof user === "object") {
          return user.equals(obj.user._id);
        }
        return user === obj.user._id;
      }),
    };
  })
  @Expose()
  like: object;

  @Transform(({ obj }) => obj.comments.length)
  @Expose()
  comments: number;

  @Expose()
  createdAt: Date;
}
