import { useQuery, useMutation, useQueryClient } from "react-query";

import "./style.css";
import img from "../../assets/user.png";
import {
  updateProfilePic,
  getUser,
  getUserPosts,
  getUserComments,
  certainUserPost,
} from "../../api/UserApi";
import { ProfilePic } from "../../components/profile/ProfilePic";
import { ProfileCaption } from "../../components/profile/ProfileCaption";
import { ProfileChangeImage } from "../../components/profile/ProfileChangeImage";
import { Loading } from "../../components/common/Loading";
import { ProfilePost } from "../../components/profile/ProfilePost";
import { useEffect } from "react";
import { useState } from "react";

export const Profile = () => {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery("user", ({ signal }) => getUser(signal));
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        console.log(user);
        const data = await certainUserPost(user.id);
        setPostData(data);
      }
    }
    fetchData();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <ProfileChangeImage user={user} />
        <ProfilePic user={user} />
        <ProfileCaption user={user} refetch={refetch} />
      </div>
      <div className="profile-post-wrapper">
        <span className="profile-post-title">게시물: {postData.length}</span>
        <div className="profile-post">
          {postData &&
            postData.map((post, index) => (
              <ProfilePost key={index} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
};
