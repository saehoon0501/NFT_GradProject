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

export const Profile = () => {
  const { data: user } = useQuery("user", ({ signal }) => getUser(signal));
  // getUserComments().then((result) => console.log(result));

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
          {[1, 2, 3].map(() => (
            <img className="profile-post-img" src={img} />
          ))}
        </div>
      </div>
    </div>
  );
};
