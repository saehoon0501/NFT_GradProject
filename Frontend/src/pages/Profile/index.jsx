import { useQuery, useMutation, useQueryClient } from "react-query";

import "./style.css";
import img from "../../assets/user.png";
import {
  updateProfilePic,
  getUser,
  getUserPosts,
  getUserComments,
} from "../../api/UserApi";
import { ProfilePic } from "../../components/profile/ProfilePic";
import { ProfileCaption } from "../../components/profile/ProfileCaption";
import { ProfileChangeImage } from "../../components/profile/ProfileChangeImage";
import { Loading } from "../../components/common/Loading";
import { ProfilePost } from "../../components/profile/ProfilePost";

export const Profile = () => {
  const { data: user, isLoading } = useQuery("user", ({ signal }) =>
    getUser(signal)
  );
  // getUserComments().then((result) => console.log(result));

  if (isLoading) {
    return <Loading />;
  }

  console.log(user);

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <ProfileChangeImage user={user} />
        <ProfilePic userProfile={user?.profile} />
        <ProfileCaption userProfile={user?.profile} />
      </div>
      <div className="profile-post-wrapper">
        <span className="profile-post-title">게시물</span>
        <div className="profile-post">
          {user?.profile.post_ids.map((postId) => (
            <ProfilePost key={postId} postId={postId} />
          ))}
        </div>
      </div>
    </div>
  );
};
