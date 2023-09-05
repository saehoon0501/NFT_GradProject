import { Expose, Transform } from "class-transformer";

export class SearchDto {
  @Transform(({ obj }) => obj._id)
  @Expose()
  post_id: string;

  @Transform(({ obj }) => {
    return {
      _id: obj.user[0]._id,
      username: obj.user[0].username,
      profile_pic: obj.user[0].profile_pic,
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
      liked_user: like.liked_user.some((user) => user.equals(obj.user[0]._id)),
    };
  })
  @Expose()
  like: object;

  @Transform(({ obj }) => obj.comments.length)
  @Expose()
  comments: number;
}
