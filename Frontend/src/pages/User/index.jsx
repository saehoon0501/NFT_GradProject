import { useQuery } from "react-query";

import "./style.css";
import { certainUser, getUser } from "../../api/UserApi";
import { ProfilePic } from "../../components/profile/ProfilePic";
import { ProfileCaption } from "../../components/profile/ProfileCaption";
import { ProfileChangeImage } from "../../components/profile/ProfileChangeImage";
import { Loading } from "../../components/common/Loading";
import { ProfilePost } from "../../components/profile/ProfilePost";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const User = () => {
  const { user_id } = useParams();
  // const { data, isLoading } = useQuery("clickedUser", certainUser(user_id));

  useEffect(() => {
    const data = certainUser(user_id);
    console.log(data);
  }, []);

  // getUserComments().then((result) => console.log(result));

  // if (isLoading) {
  //   return <Loading />;
  // }

  // console.log(data);

  return (
    <div className="profile-container">
      {/* <div className="profile-wrapper">
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
      </div> */}
      <h1>Hello</h1>
    </div>
  );
};
