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
      <div
        style={{
          width: "900px",
          height: "1px",
          borderBottom: "1px solid lightgray",
          margin: "3% auto",
        }}
      >
        <div className="profile-post">
          <h4>게시물</h4>
        </div>
        <div className="profile-post">
          {[1, 2, 3].map(() => (
            <img src={img} style={{ width: "30%" }} />
          ))}
        </div>
      </div>
    </div>
  );
};
