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
        const data = await certainUserPost(user._id);
        setPostData(data[0].posts);
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
        <ProfilePic userProfile={user?.profile} />
        <ProfileCaption userProfile={user?.profile} refetch={refetch} />
      </div>
      <div className="profile-post-wrapper">
        <span className="profile-post-title">게시물</span>
        <div className="profile-post">
          {postData &&
            postData.map((post, index) => (
              <ProfilePost
                key={index}
                title={post.title}
                postId={post._id}
                commentCount={post.comments.length}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
