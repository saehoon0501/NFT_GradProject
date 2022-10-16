import { useQuery } from "react-query";

import "./style.css";
import { certainUser, certainUserPost } from "../../api/UserApi";
import { ProfilePic } from "../../components/profile/ProfilePic";
import { ProfileCaption } from "../../components/profile/ProfileCaption";
import { ProfileChangeImage } from "../../components/profile/ProfileChangeImage";
import { Loading } from "../../components/common/Loading";
import { ProfilePost } from "../../components/profile/ProfilePost";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const User = () => {
  const { user_id } = useParams();
  const { data: user, isLoading } = useQuery("clickedUser", () =>
    certainUser(user_id)
  );

  const [postData, setPostData] = useState([]);
  // getUserComments().then((result) => console.log(result));

  useEffect(async () => {
    async function fetchData() {
      const data = await certainUserPost(user.publicAddr);
      setPostData(data);
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
        <ProfilePic userProfile={user?.profile} isOwner={false} />
        <ProfileCaption userProfile={user?.profile} isOwner={false} />
      </div>
      <div className="profile-post-wrapper">
        <span className="profile-post-title">게시물</span>
        <div className="profile-post">
          {postData &&
            postData[0]?.posts?.map((post, index) => (
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
