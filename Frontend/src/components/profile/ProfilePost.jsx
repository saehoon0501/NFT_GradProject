import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePost.css";

export const ProfilePost = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  // const onClickPost = () => {
  //   navigate(`/post/${postId}`);
  // };

  // useEffect(() => {
  //   const data = certainUserPost(publicAddr);
  //   console.log(data);
  // }, []);

  return (
    <div
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
      className="profile_post_wrapper"
    >
      {isHovered ? (
        <p className="profile_post_detail">
          좋아요: {post.liked_num} 댓글: {post.comments}
        </p>
      ) : (
        <p className="profile_post_title">{post.title}</p>
      )}
    </div>
  );
};
