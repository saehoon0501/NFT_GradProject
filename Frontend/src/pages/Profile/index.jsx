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
  const { data: user, isLoading } = useQuery("user", ({ signal }) =>
    getUser(signal)
  );
  const [postData, setPostData] = useState([]);
  // getUserComments().then((result) => console.log(result));

  useEffect(() => {
    async function fetchData() {
      const data = await certainUserPost(user.publicAddr);
      setPostData(data);
    }
    fetchData();
  }, [user]);

  console.log(postData);

  if (isLoading) {
    return <Loading />;
  }

  // const handleClick = () => {
  //   navigate(`/post/${post_id}`, {
  //     state: {
  //       post_id,
  //       writer_profile,
  //       user_id,
  //       caption,
  //       title,
  //       likes,
  //       comment_ids: comments,
  //     },
  //   });
  // };

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
          {postData?.map((post, index) => (
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
