import { Expose, Transform } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  role: number;

  @Expose()
  description: string;

  @Expose()
  points: number;

  @Expose()
  profile_pic: number;

  @Expose()
  username: number;

  @Transform(({ obj }) => {
    const nfturls = obj.owner_of_nft.map((collection) => collection.nft_url);
    return [].concat(...nfturls);
  })
  @Expose()
  nft_urls: string[];
}
